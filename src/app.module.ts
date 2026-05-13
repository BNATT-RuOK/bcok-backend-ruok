import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [UsersModule, EmergencyModule, CheckinModule, AuthModule, ContactModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
