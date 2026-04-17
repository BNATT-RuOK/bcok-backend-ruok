import { EmergencyStatus } from '../dto/create-emergency.dto';
export interface Emergency {
    id: number;
    userId: number;
    location: string;
    status: EmergencyStatus;
    timestamp: string;
    createdAt: string;
}
