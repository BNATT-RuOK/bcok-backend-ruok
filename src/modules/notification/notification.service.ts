import { Injectable, Logger } from "@nestjs/common";
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private expo = new Expo();
    private transporter : nodemailer.Transporter;
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.BREVO_HOST,
            port: Number(process.env.BREVO_PORT),
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_PASSWORD,
            },
        });
    }

    async sendPushNotification(pushToken: string, title: string, body: string) {
        if (!Expo.isExpoPushToken(pushToken)) {
            this.logger.warn(`Push token: ${pushToken} khong hop le!`);
            return;
        }
        const message: ExpoPushMessage[] = [{
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            priority: 'high',
            data: {screen: 'SosDetail'},
        }];

        try { //Chia nhỏ các mảng tin nhắn lớn
            const chunks = this.expo.chunkPushNotifications(message);
            for (const chunk of chunks) {
                await this.expo.sendPushNotificationsAsync(chunk);
            }
            this.logger.log(`Da gui thong bao push toi token: ${pushToken}`);
        } catch (error) {
            this.logger.error(`Loi khi gui thong bao push toi token: ${pushToken}`, error);
        }
    }

    async sendAlertEmail(toEmail: string, subject: string, message: string) {
        try {
            await this.transporter.sendMail({
                from: `"RuOK Safety Alert" <${process.env.BREVO_SENDER}>`,
                to: toEmail,
                subject: subject,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ff4d4f; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #ff4d4f; padding: 15px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px;">CẢNH BÁO KHẨN CẤP</h2>
            </div>
            <div style="padding: 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                ${message}
            </div>
            <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #888;">
              Tin nhắn tự động từ nền tảng kết nối an toàn sinh viên RuOK.<br>Vui lòng không trả lời email này.
            </div>
          </div>
        `,
        });
        this.logger.log(`Da gui email canh bao toi: ${toEmail}`);
        } catch (error) {
            this.logger.error(`Loi khi gui email canh bao toi: ${toEmail}`, error);
        }

    }
}

