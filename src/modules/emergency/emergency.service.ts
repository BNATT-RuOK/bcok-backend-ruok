import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';

@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  async triggerSos(dto: CreateEmergencyDto) {
    this.logger.error(`KÍCH HOẠT SOS TỪ USER ID: ${dto.userId}`);
    //Luu trang thai SOS vao DB
    const sosAlert = await this.prisma.sOS_ALERT.create(
      {
        data: {
          user_id: dto.userId,
          trigger_type: 'MANUAL_SOS', //Bam nut vat ly/tren app
          latitude: dto.latitude,
          longitude: dto.longitude,
          photo_url: dto.photoUrl,
          status: 'ACTIVE',
        },
      });
  
  const user=await this.prisma.uSER.findUnique({
     where: { user_id: dto.userId },
     include: { CONTACT: true },
  });

  if (!user)
    throw new NotFoundException('Người dùng không tồn tại');
  
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
    //Gui Email neu co
    if (contact.email) {
      await this.notificationService.sendAlertEmail(contact.email, alertTitle, alertMsgHtml);
    }
    
    if (contact.expo_push_token) {
      await this.notificationService.sendPushNotification(
        contact.expo_push_token, 
        alertTitle, 
        alertMsgPlain);
    } else {
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
  
}