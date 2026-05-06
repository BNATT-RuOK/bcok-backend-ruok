import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
export declare class CheckinController {
    private readonly checkinService;
    constructor(checkinService: CheckinService);
    create(createCheckinDto: CreateCheckinDto): Promise<{
        user_id: number | null;
        status: string | null;
        checkin_id: number;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }>;
    findAll(): Promise<{
        user_id: number | null;
        status: string | null;
        checkin_id: number;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }[]>;
    markAsSafe(id: string): Promise<{
        user_id: number | null;
        status: string | null;
        checkin_id: number;
        scheduled_time: Date | null;
        actual_time: Date | null;
    }>;
}
