import { PrismaService } from '../../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
export declare class CheckinService {
    private prisma;
    private notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    create(dto: CreateCheckinDto): Promise<{
        status: string | null;
        checkin_id: number;
        user_id: number | null;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }>;
    findAll(): Promise<{
        status: string | null;
        checkin_id: number;
        user_id: number | null;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }[]>;
    markAsSafe(checkinId: number): Promise<{
        status: string | null;
        checkin_id: number;
        user_id: number | null;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }>;
    handleMissedCheckins(): Promise<void>;
}
