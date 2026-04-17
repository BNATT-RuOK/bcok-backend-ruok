import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
export declare class EmergencyController {
    private readonly emergencyService;
    constructor(emergencyService: EmergencyService);
    findAll(): import("./entities/emergency.entity").Emergency[];
    findOne(id: number): import("./entities/emergency.entity").Emergency;
    create(dto: CreateEmergencyDto): import("./entities/emergency.entity").Emergency;
    remove(id: number): {
        message: string;
    };
}
