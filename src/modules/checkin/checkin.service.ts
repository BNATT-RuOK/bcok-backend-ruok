import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { CreateCheckinDto, CheckinStatus } from './dto/create-checkin.dto';


@Injectable()
export class CheckinService {
  private readonly logger = new Logger(CheckinService.name);
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService
  ) { }

  // ── CREATE ─────────────────────────────────────────────────────────────────
  async create(dto: CreateCheckinDto) {
    const newCheckin = await this.prisma.cHECKIN.create({
      data: {
        user_id: dto.userId, // Map tu DTO (camelCase) sang DB (snake_case)
        scheduled_time: dto.scheduledTime ? new Date(dto.scheduledTime) : new Date(),
        status: dto.status || 'PENDING',
        //Khong co location vi FE khong gui len, de sau nay mo rong them tinh nang gui location thi moi them vao DB va DTO
      },
    });
    this.logger.log(`Đã tạo Check-in (ID: ${newCheckin.checkin_id}) cho User #${dto.userId}`);
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
  async markAsSafe(checkinId: number) {
    const checkin = await this.prisma.cHECKIN.findUnique({ where: { checkin_id: checkinId } });
    if (!checkin) throw new NotFoundException('Không tìm thấy lượt Check-in này');

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
  // ── PROACTIVE PASSIVE MONITORING ───────────────────────────────────────────────
  @Cron(CronExpression.EVERY_MINUTE) //Gọi hàm này mỗi phút để kiểm tra các check-in cũ
  async handleMissedCheckins() {
    this.logger.log('Dang chay kiem tra cac check-in da het han...');
    const currentTime = new Date();
    try {
      // TÌM CHECK-IN LỠ HẸN
      // Lấy các checkin có lịch hẹn (scheduled_time) đã qua và status đang là 'PENDING'
      const missedCheckins = await this.prisma.cHECKIN.findMany({
        where: {
          status: 'PENDING',
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
      if (missedCheckins.length === 0) return;
      // XỬ LÝ CHECK-IN LỠ HẸN
      for (const checkin of missedCheckins) {
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
      }
    } catch (error) {
      this.logger.error('Lỗi khi quét Check-in lỡ hẹn:', error);
    }
  }
}
