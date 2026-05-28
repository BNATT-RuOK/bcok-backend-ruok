import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma.service';
import { TimeService } from './time.service';
import { CheckinModule } from '../checkin/checkin.module';

@Module({
  controllers: [UsersController],
  imports: [CheckinModule],
  providers: [UsersService, PrismaService, TimeService],
  exports: [UsersService, TimeService],
})
export class UsersModule { }
