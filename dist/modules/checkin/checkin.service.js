"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CheckinService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const schedule_1 = require("@nestjs/schedule");
const notification_service_1 = require("../notification/notification.service");
const create_checkin_dto_1 = require("./dto/create-checkin.dto");
let CheckinService = CheckinService_1 = class CheckinService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(CheckinService_1.name);
    }
    async create(dto) {
        const newCheckin = await this.prisma.cHECKIN.create({
            data: {
                user_id: dto.userId,
                scheduled_time: dto.scheduledTime ? new Date(dto.scheduledTime) : new Date(),
                status: dto.status || 'PENDING',
            },
        });
        this.logger.log(`Đã tạo Check-in (ID: ${newCheckin.checkin_id}) cho User #${dto.userId}`);
        return newCheckin;
    }
    async findAll() {
        return await this.prisma.cHECKIN.findMany({
            orderBy: { scheduled_time: 'desc' }
        });
    }
    async markAsSafe(checkinId) {
        const checkin = await this.prisma.cHECKIN.findUnique({ where: { checkin_id: checkinId } });
        if (!checkin)
            throw new common_1.NotFoundException('Không tìm thấy lượt Check-in này');
        const updated = await this.prisma.cHECKIN.update({
            where: { checkin_id: checkinId },
            data: {
                status: create_checkin_dto_1.CheckinStatus.SAFE,
                actual_time: new Date(),
            },
        });
        this.logger.log(`Check-in ID: ${checkinId} đã được đánh dấu AN TOÀN.`);
        return updated;
    }
    async handleMissedCheckins() {
        this.logger.log('Dang chay kiem tra cac check-in da het han...');
        const currentTime = new Date();
        try {
            const missedCheckins = await this.prisma.cHECKIN.findMany({
                where: {
                    status: 'PENDING',
                    scheduled_time: {
                        lt: currentTime,
                    },
                },
                include: {
                    USER: {
                        include: {
                            CONTACT: true,
                        },
                    },
                },
            });
            if (missedCheckins.length === 0)
                return;
            for (const checkin of missedCheckins) {
                const userName = checkin.USER?.full_name || checkin.USER?.email || 'Sinh viên';
                this.logger.warn(`Phat hien lo hen checkin: User ID ${checkin.user_id} (${userName})`);
                await this.prisma.cHECKIN.update({
                    where: { checkin_id: checkin.checkin_id },
                    data: { status: 'MISSED' },
                });
                const newSosAlert = await this.prisma.sOS_ALERT.create({
                    data: {
                        user_id: checkin.user_id,
                        trigger_type: 'MISSED_CHECKIN',
                        status: 'ACTIVE',
                    },
                });
                const contacts = checkin.USER?.CONTACT || [];
                for (const contact of contacts) {
                    const studentName = checkin.USER?.full_name || checkin.USER?.email || 'Sinh viên';
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
                    if (contact.email)
                        await this.notificationService.sendAlertEmail(contact.email, alertTitle, alertMsg);
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
        }
        catch (error) {
            this.logger.error('Lỗi khi quét Check-in lỡ hẹn:', error);
        }
    }
};
exports.CheckinService = CheckinService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CheckinService.prototype, "handleMissedCheckins", null);
exports.CheckinService = CheckinService = CheckinService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], CheckinService);
//# sourceMappingURL=checkin.service.js.map