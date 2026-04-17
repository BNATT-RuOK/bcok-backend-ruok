import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { Emergency } from './entities/emergency.entity';
export declare class EmergencyService {
    private readonly logger;
    private emergencies;
    private nextId;
    create(dto: CreateEmergencyDto): Emergency;
    findAll(): Emergency[];
    findOne(id: number): Emergency;
    remove(id: number): {
        message: string;
    };
}
