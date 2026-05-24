import { Module } from '@nestjs/common';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { PrismaService } from '../../prisma.service';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NotificationModule, AuthModule],
  controllers: [EmergencyController],
  providers: [EmergencyService, PrismaService],
})
export class EmergencyModule { }
