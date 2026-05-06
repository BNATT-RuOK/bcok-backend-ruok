import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
export declare class EmergencyController {
    private readonly emergencyService;
    constructor(emergencyService: EmergencyService);
    triggerSos(createEmergencyDto: CreateEmergencyDto): Promise<{
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
