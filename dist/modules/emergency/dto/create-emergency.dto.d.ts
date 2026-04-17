export declare enum EmergencyStatus {
    SOS = "SOS",
    RESOLVED = "RESOLVED"
}
export declare class CreateEmergencyDto {
    userId: number;
    location: string;
    status: EmergencyStatus;
    timestamp: string;
}
