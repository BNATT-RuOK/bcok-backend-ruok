import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';

type AuthenticatedEmergencyPayload = CreateEmergencyDto & {
  userId: number;
};

@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  /**
   * Tạo Read SAS URL từ blobUrl (không có SAS).
   * Dùng để gửi qua email/push cho người thân – chỉ quyền đọc, hết hạn 24 giờ.
   * Container vẫn Private, người thân truy cập được nhờ SAS token trong URL.
   */
  private generateReadUrl(blobUrl?: string): string | undefined {
    if (!blobUrl) return undefined;

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!connectionString || !containerName) {
      this.logger.warn('Azure Blob Storage environment variables are missing');
      return undefined;
    }

    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

    if (!accountNameMatch || !accountKeyMatch) {
      this.logger.warn('Invalid Azure Storage connection string');
      return undefined;
    }

    const accountName = accountNameMatch[1];
    const accountKey = accountKeyMatch[1];

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);

    const containerClient =
      blobServiceClient.getContainerClient(containerName);

    const containerPrefix = `${containerClient.url}/`;

    if (!blobUrl.startsWith(containerPrefix)) {
      this.logger.warn('Blob URL does not belong to configured SOS container');
      return undefined;
    }

    const blobName = decodeURIComponent(
      blobUrl.substring(containerPrefix.length),
    );

    // Read SAS: chỉ quyền đọc, hết hạn 24 giờ
    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 24);

    const sasPermissions = new BlobSASPermissions();
    sasPermissions.read = true;

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: sasPermissions,
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    return `${blobUrl}?${sasToken}`;
  }

  async triggerSos(dto: AuthenticatedEmergencyPayload) {
    const authenticatedUser = await this.prisma.uSER.findUnique({
      where: { user_id: dto.userId },
      include: { CONTACT: true },
    });

    if (!authenticatedUser) {
      throw new NotFoundException('User does not exist');
    }

    this.logger.error(`KÍCH HOẠT SOS TỪ USER ID: ${dto.userId}`);
    //Luu trang thai SOS vao DB (lưu blobUrl gốc, không có SAS token)
    const sosAlert = await this.prisma.sOS_ALERT.create({
      data: {
        user_id: dto.userId,
        trigger_type: 'MANUAL_SOS', //Bam nut vat ly/tren app
        latitude: dto.latitude,
        longitude: dto.longitude,
        photo_url: dto.photoUrl,
        audio_url: dto.audioUrl,
        status: 'ACTIVE',
      },
    });

    // Tạo Read SAS URL (24h) từ blobUrl gốc → dùng gửi email/push
    const photoReadUrl = this.generateReadUrl(dto.photoUrl);
    const audioReadUrl = this.generateReadUrl(dto.audioUrl);

    const user = authenticatedUser;

    if (!user)
      throw new NotFoundException('Người dùng không tồn tại');

    const userName = user.full_name || `User #${dto.userId}`;
    const studentPhone = user.phone_number ? `(SĐT: ${user.phone_number})` : '';
    const hasLocation =
      dto.latitude !== undefined && dto.longitude !== undefined;
    const locationInfo = hasLocation
      ? `Vị trí hiện tại: https://maps.google.com/?q=${dto.latitude},${dto.longitude}`
      : 'Không xác định được vị trí GPS.';

    const contacts = user.CONTACT || [];
    for (const contact of contacts) {
      const alertTitle = `CẤP CỨU RUOK: ${userName} ĐANG GẶP NGUY HIỂM!`;
      const alertMsgPlain = `Hệ thống nhận được tín hiệu SOS khẩn cấp từ ${userName} ${studentPhone}.\n${locationInfo}\nVui lòng liên lạc hoặc báo cơ quan chức năng ngay lập tức!`;
      const alertMsgHtml = alertMsgPlain.replace(/\n/g, '<br>');
      //Gui Email neu co — dùng Read SAS URL thay vì blobUrl thô
      if (contact.email) {
        await this.notificationService.sendAlertEmail(
          contact.email,
          alertTitle,
          alertMsgHtml,
          photoReadUrl,
          audioReadUrl,
        );
      }

      if (contact.expo_push_token) {
        await this.notificationService.sendPushNotification(
          contact.expo_push_token,
          alertTitle,
          alertMsgPlain,
          sosAlert.sos_id,
          photoReadUrl,
          audioReadUrl,
        );
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

  /**
   * Tạo Upload SAS URL – chỉ cấp quyền create+write (KHÔNG có read).
   * Hết hạn sau 5 phút. Mobile app dùng URL này để PUT file lên Azure Blob.
   */
  async generateUploadUrl(
    type: 'photo' | 'audio',
    userId: number,
  ): Promise<{ uploadUrl: string; blobUrl: string }> {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!connectionString || !containerName) {
      throw new Error('Azure Storage configuration is missing');
    }

    const extension = type === 'photo' ? 'jpg' : 'm4a';
    const blobName = `sos/${userId}/${Date.now()}_${type}.${extension}`;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Parse account name and key from connection string
    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

    if (!accountNameMatch || !accountKeyMatch) {
      throw new Error('Invalid Azure Storage connection string');
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountNameMatch[1],
      accountKeyMatch[1],
    );

    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 5);

    // Upload SAS: chỉ create+write, KHÔNG có read
    const sasPermissions = new BlobSASPermissions();
    sasPermissions.create = true;
    sasPermissions.write = true;

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: sasPermissions,
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    const blobClient = blobServiceClient
      .getContainerClient(containerName)
      .getBlockBlobClient(blobName);

    const blobUrl = blobClient.url; // URL without query string

    return {
      uploadUrl: `${blobUrl}?${sasToken}`,
      blobUrl,
    };
  }
}
