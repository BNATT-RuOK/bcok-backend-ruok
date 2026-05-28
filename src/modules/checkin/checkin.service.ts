import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { CreateCheckinDto, CheckinStatus } from './dto/create-checkin.dto';
import { UpdateScheduledTimeDto } from './dto/update-scheduled-time.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CheckinService {
  private readonly logger = new Logger(CheckinService.name);
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService
  ) { }

  // ── CREATE ─────────────────────────────────────────────────────────────────
  async create(userId: number, dto: CreateCheckinDto, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    const newCheckin = await prismaClient.cHECKIN.create({
      data: {
        user_id: userId,
        scheduled_time: dto.scheduledTime ? new Date(dto.scheduledTime) : new Date(Date.now() + 60 * 60 * 1000),
        status: dto.status || 'PENDING',
        //Khong co location vi FE khong gui len, de sau nay mo rong them tinh nang gui location thi moi them vao DB va DTO
      },
    });
    this.logger.log(`Đã tạo Check-in (ID: ${newCheckin.checkin_id}) cho User #${userId}`);
    return newCheckin;
  }


  async findAll(userId: number) {
    // return await this.prisma.cHECKIN.findMany({
    // where: { user_id: userId },
    // orderBy: { scheduled_time: 'desc' } // Sắp xếp check-in mới nhất lên đầu
    const checkins = await this.prisma.$queryRaw`
        SELECT 
          c.*,
          COALESCE(con.contact_name, u.full_name, con.email, u.email) as name,
          con.relationship as relationship
        FROM "CHECKIN" c
        LEFT JOIN "USER" u ON c.user_id = u.user_id
        LEFT JOIN "CONTACT" con ON u.phone_number = con.contact_phone AND con.user_id = ${userId}
        WHERE 
          c.user_id = ${userId}
          
          -- Check-in của những user nằm trong danh bạ của bản thân
          OR c.user_id IN (
            SELECT usr.user_id 
            FROM "CONTACT" con JOIN "USER" usr ON con.contact_phone = usr.phone_number AND con.user_id = ${userId}
          )

        ORDER BY c."scheduled_time" DESC;
        `;
    return checkins;
  }

  // ──UPDATE TO SAFE ─────────────────────────────────────────────────────
  async markAsSafe(userId: number, checkinId: number) {
    const checkin = await this.prisma.cHECKIN.findUnique({ where: { checkin_id: checkinId } });
    if (!checkin) throw new NotFoundException('Không tìm thấy lượt Check-in này');
    if (checkin.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền thay đổi Check-in của người khác');
    }

    const updated = await this.prisma.cHECKIN.update({
      where: { checkin_id: checkinId },
      data: {
        status: CheckinStatus.SAFE,
        actual_time: new Date(), // Ghi nhan thoi gian xac nhan an toan
      },
    });
    this.logger.log(`Check-in ID: ${checkinId} đã được đánh dấu AN TOÀN.`);
    return updated;
  }


  // ── UPDATE SCHEDULED TIME ──────────────────────────────────────────────────
  async updateScheduledTime(userId: number, dto: UpdateScheduledTimeDto) {
    const checkins = await this.prisma.cHECKIN.findMany({
      where: { user_id: userId, status: { in: [CheckinStatus.PENDING, CheckinStatus.IN_TRANSIT] } },
      orderBy: { scheduled_time: 'desc' },
      take: 10,
    });
    if (checkins.length === 0) {
      this.create(userId, { scheduledTime: dto.scheduledTime });
    }
    for (const checkin of checkins) {
      const currentStatus = checkin.status?.toUpperCase();
      if (currentStatus !== 'PENDING' && currentStatus !== 'IN_TRANSIT') {
        throw new BadRequestException(
          `Chỉ được phép sửa đổi thời gian hẹn khi trạng thái là PENDING hoặc IN_TRANSIT. Trạng thái hiện tại: ${checkin.status}`,
        );
      }
      const newTime = new Date(dto.scheduledTime)
      const newStatus = newTime > new Date() ? 'PENDING' : 'IN_TRANSIT'
      const updated = await this.prisma.cHECKIN.update({
        where: { checkin_id: checkin.checkin_id },
        data: {
          scheduled_time: newTime,
          status: newStatus,
        },
      });
      this.logger.log(`Check-in ID: ${checkin.checkin_id} đã được cập nhật scheduled_time thành ${dto.scheduledTime}.`);
    }
    return { message: 'Cập nhật thành công' };
  }


  // ── PROACTIVE PASSIVE MONITORING ───────────────────────────────────────────────
  @Cron(CronExpression.EVERY_MINUTE) //Gọi hàm này mỗi phút để kiểm tra các check-in cũ
  async handleMissedCheckins() {
    this.logger.log('Dang chay kiem tra cac check-in da het han...');
    const currentTime = new Date();
    try {
      // TÌM CHECK-IN LỠ HẸN
      // Lấy các checkin có lịch hẹn (scheduled_time) đã qua và status đang là 'PENDING' hoặc 'IN_TRANSIT'
      const activeCheckins = await this.prisma.cHECKIN.findMany({
        where: {
          status: {
            in: ['PENDING', 'IN_TRANSIT'],
          },
          scheduled_time: {
            lt: currentTime, // Thời gian hẹn < Thời gian hiện tại
          },
        },
        include: {
          USER: {
            include: {
              CONTACT: true, // Kéo theo danh sách người liên hệ khẩn cấp
            },
          },
        },
      });

      if (activeCheckins.length === 0) return;

      // XỬ LÝ CHECK-IN
      for (const checkin of activeCheckins) {
        // default sos_timeout_mins là 12 tiếng = 12 * 60 phút = 720 phút
        const timeoutMins = checkin.USER?.sos_timeout_mins ?? (12 * 60);
        const scheduledTime = checkin.scheduled_time ? new Date(checkin.scheduled_time) : new Date();
        const missedThreshold = new Date(scheduledTime.getTime() + timeoutMins * 60 * 1000);
        if (currentTime > missedThreshold) {
          // QUÁ HẠN ĐÃ QUA THỜI GIAN SOS_TIMEOUT_MINS -> CHUYỂN THÀNH MISSED VÀ BÁO ĐỘNG
          const userName = checkin.USER?.full_name || checkin.USER?.email || 'Sinh viên';
          this.logger.warn(`Phat hien lo hen checkin: User ID ${checkin.user_id} (${userName})`);
          // Cap nhat thanh MISSED (tranh bi quet trung)
          await this.prisma.cHECKIN.update({
            where: { checkin_id: checkin.checkin_id },
            data: { status: 'MISSED' },
          });
          //Gui thong bao khi lo hen
          const newSosAlert = await this.prisma.sOS_ALERT.create({
            data: {
              user_id: checkin.user_id,
              trigger_type: 'MISSED_CHECKIN', // Phân loại nguồn gốc SOS
              status: 'ACTIVE',
              // Khong kem vi tri
            },
          });
          //Gửi thông báo đẩy và email cảnh báo
          const contacts = checkin.USER?.CONTACT || [];
          for (const contact of contacts) {
            const studentName = checkin.USER?.full_name || checkin.USER?.email || 'Sinh viên';
            // Lấy SĐT của sinh viên (nếu có trong bảng USER) để hiển thị cho phụ huynh gọi
            const studentPhone = checkin.USER?.phone_number ? `(SĐT: ${checkin.USER.phone_number})` : '';
            const contactName = contact.contact_name || 'Phụ huynh/Người thân';

            const alertTitle = `[RuOK] Cảnh báo lỡ xác nhận an toàn - ${studentName}`;
            const alertMsg = `
              Kính gửi <b>${contactName}</b>,<br><br>
              Hệ thống bảo vệ RuOK xin thông báo: Sinh viên <b>${studentName}</b> ${studentPhone} đã <b>KHÔNG</b> bấm xác nhận an toàn đúng hạn.<br><br>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin-bottom: 20px;">
                <b>THÔNG TIN CHI TIẾT:</b>
                <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                <li><b>Thời gian hẹn xác nhận:</b> ${checkin.scheduled_time?.toLocaleString('vi-VN')}</li>
                  <li><b>Mức độ:</b> Cần chú ý (Lỡ hẹn check-in)</li>
                </ul>
              </div>

              <b>HÀNH ĐỘNG ĐỀ NGHỊ:</b>
              <ol style="margin-top: 5px; padding-left: 20px;">
                <li>Gọi điện thoại liên lạc trực tiếp với <b>${studentName}</b> ngay lập tức.</li>
                <li>Mở ứng dụng RuOK (nếu có cài đặt) để xem vị trí định vị cuối cùng được ghi nhận.</li>
                <li>Liên hệ với bạn bè cùng lớp hoặc cơ quan chức năng nếu không thể kết nối trong thời gian dài.</li>
              </ol>
            `;

            // Gửi Email nếu người thân có đăng ký email
            if (contact.email)
              await this.notificationService.sendAlertEmail(contact.email, alertTitle, alertMsg);

            //Luu lich su thong bao vao database
            await this.prisma.nOTIFICATION.create({
              data: {
                sos_id: newSosAlert.sos_id,
                user_id: checkin.user_id,
                contact_phone: contact.contact_phone,
                notification_type: 'EMAIL',
                status: 'SENT',
              },
            });

            this.logger.log(`Đã lưu lịch sử báo động cho liên hệ có SĐT: ${contact.contact_phone}`);
          }
        } else {
          // NẰM TRONG KHOẢNG HẾT HẠN HẸN NHƯNG CHƯA ĐẾN BÁO ĐỘNG SOS -> CHUYỂN SANG IN_TRANSIT
          if (checkin.status === 'PENDING') {
            await this.prisma.cHECKIN.update({
              where: { checkin_id: checkin.checkin_id },
              data: { status: 'IN_TRANSIT' },
            });
            this.logger.log(`Check-in ID: ${checkin.checkin_id} cua User ID ${checkin.user_id} da chuyen sang IN_TRANSIT.`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Lỗi khi quét Check-in lỡ hẹn:', error);
    }
  }
}
