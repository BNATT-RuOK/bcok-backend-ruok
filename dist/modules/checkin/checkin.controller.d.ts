import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
export declare class CheckinController {
    private readonly checkinService;
    constructor(checkinService: CheckinService);
    create(createCheckinDto: CreateCheckinDto): Promise<{
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
    markAsSafe(id: string): Promise<{
        status: string | null;
        checkin_id: number;
        user_id: number | null;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }>;
}
