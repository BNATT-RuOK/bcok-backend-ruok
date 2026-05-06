export declare enum CheckinStatus {
    PENDING = "PENDING",
    IN_TRANSIT = "IN_TRANSIT",
    SAFE = "SAFE",
    MISSED = "MISSED"
}
export declare class CreateCheckinDto {
    userId: number;
    scheduledTime?: string;
    status?: CheckinStatus;
}
