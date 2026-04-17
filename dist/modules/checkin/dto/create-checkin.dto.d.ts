export declare enum CheckinStatus {
    SAFE = "SAFE",
    IN_TRANSIT = "IN_TRANSIT"
}
export declare class CreateCheckinDto {
    userId: number;
    location: string;
    status: CheckinStatus;
    timestamp: string;
}
