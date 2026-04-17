import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
export declare class CheckinController {
    private readonly checkinService;
    constructor(checkinService: CheckinService);
    findAll(): import("./entities/checkin.entity").Checkin[];
    create(dto: CreateCheckinDto): import("./entities/checkin.entity").Checkin;
}
