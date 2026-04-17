import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startTime = new Date();

  getHealth() {
    const uptime = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
    return {
      status: 'OK',
      app: 'RuOK – Hybrid Safety Model API',
      version: '1.0.0',
      uptime: `${uptime}s`,
      timestamp: new Date().toISOString(),
    };
  }
}
