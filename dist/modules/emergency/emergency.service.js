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
var EmergencyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const notification_service_1 = require("../notification/notification.service");
let EmergencyService = EmergencyService_1 = class EmergencyService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(EmergencyService_1.name);
    }
    async triggerSos(dto) {
        this.logger.error(`KÍCH HOẠT SOS TỪ USER ID: ${dto.userId}`);
        const sosAlert = await this.prisma.sOS_ALERT.create({
            data: {
                user_id: dto.userId,
                trigger_type: 'MANUAL_SOS',
                latitude: dto.latitude,
                longitude: dto.longitude,
                photo_url: dto.photoUrl,
                status: 'ACTIVE',
            },
        });
        const user = await this.prisma.uSER.findUnique({
            where: { user_id: dto.userId },
            include: { CONTACT: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        const userName = user.full_name || `User #${dto.userId}`;
        const studentPhone = user.phone_number ? `(SĐT: ${user.phone_number})` : '';
        const locationInfo = (dto.latitude && dto.longitude)
            ? `Vị trí hiện tại: https://maps.google.com/?q=${dto.latitude},${dto.longitude}`
            : 'Không xác định được vị trí GPS.';
        const contacts = user.CONTACT || [];
        for (const contact of contacts) {
            const alertTitle = `CẤP CỨU RUOK: ${userName} ĐANG GẶP NGUY HIỂM!`;
            const alertMsgPlain = `Hệ thống nhận được tín hiệu SOS khẩn cấp từ ${userName} ${studentPhone}.\n${locationInfo}\nVui lòng liên lạc hoặc báo cơ quan chức năng ngay lập tức!`;
            const alertMsgHtml = alertMsgPlain.replace(/\n/g, '<br>');
            if (contact.email) {
                await this.notificationService.sendAlertEmail(contact.email, alertTitle, alertMsgHtml);
            }
            if (contact.expo_push_token) {
                await this.notificationService.sendPushNotification(contact.expo_push_token, alertTitle, alertMsgPlain);
            }
            else {
                this.logger.warn(`Người thân ${contact.contact_phone} chưa cài App (Không có Push Token).`);
            }
            await this.prisma.nOTIFICATION.create({
                data: {
                    user_id: user.user_id,
                    sos_id: sosAlert.sos_id,
                    contact_phone: contact.contact_phone,
                    notification_type: 'EMERGENCY_SOS',
                    status: 'SENT',
                },
            });
        }
        return sosAlert;
    }
};
exports.EmergencyService = EmergencyService;
exports.EmergencyService = EmergencyService = EmergencyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], EmergencyService);
//# sourceMappingURL=emergency.service.js.map