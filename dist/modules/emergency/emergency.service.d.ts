import { PrismaService } from '../../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
export declare class EmergencyService {
    private readonly prisma;
    private readonly notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    triggerSos(dto: CreateEmergencyDto): Promise<{
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
        sos_id: number;
        user_id: number | null;
        trigger_type: string | null;
        triggered_at: Date | null;
        photo_url: string | null;
        status: string | null;
    }>;
}
