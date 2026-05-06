import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [UsersModule, EmergencyModule, CheckinModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
