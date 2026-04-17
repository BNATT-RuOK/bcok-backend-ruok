export declare class AppService {
    private readonly startTime;
    getHealth(): {
        status: string;
        app: string;
        version: string;
        uptime: string;
        timestamp: string;
    };
}
