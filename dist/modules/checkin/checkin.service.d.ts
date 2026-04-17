import { CreateCheckinDto } from './dto/create-checkin.dto';
import { Checkin } from './entities/checkin.entity';
export declare class CheckinService {
    private readonly logger;
    private checkins;
    private nextId;
    create(dto: CreateCheckinDto): Checkin;
    findAll(): Checkin[];
}
