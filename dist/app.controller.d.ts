import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHealth(): {
        status: string;
        app: string;
        version: string;
        uptime: string;
        timestamp: string;
    };
}
