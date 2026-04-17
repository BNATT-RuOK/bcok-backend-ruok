import { Injectable, Logger } from '@nestjs/common';
import { CreateCheckinDto, CheckinStatus } from './dto/create-checkin.dto';
import { Checkin } from './entities/checkin.entity';

@Injectable()
export class CheckinService {
  private readonly logger = new Logger(CheckinService.name);

  // ── In-memory store with seed data ────────────────────────────────────────
  private checkins: Checkin[] = [
    {
      id: 1,
      userId: 1,
      location: 'Vincom Center, Quận 1, TP.HCM',
      status: CheckinStatus.SAFE,
      timestamp: '2025-04-15T09:00:00.000Z',
      createdAt: new Date('2025-04-15T09:00:00Z').toISOString(),
    },
    {
      id: 2,
      userId: 2,
      location: 'Hồ Hoàn Kiếm, Hà Nội',
      status: CheckinStatus.IN_TRANSIT,
      timestamp: '2025-04-17T07:45:00.000Z',
      createdAt: new Date('2025-04-17T07:45:00Z').toISOString(),
    },
    {
      id: 3,
      userId: 3,
      location: 'Bãi biển Mỹ Khê, Đà Nẵng',
      status: CheckinStatus.SAFE,
      timestamp: '2025-04-17T08:30:00.000Z',
      createdAt: new Date('2025-04-17T08:30:00Z').toISOString(),
    },
  ];

  private nextId = 4;

  // ── CREATE ─────────────────────────────────────────────────────────────────
  create(dto: CreateCheckinDto): Checkin {
    const checkin: Checkin = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.checkins.push(checkin);
    this.logger.log(`✅ Check-in #${checkin.id} – user #${dto.userId} is ${dto.status} at ${dto.location}`);
    return checkin;
  }

  // ── READ ALL ───────────────────────────────────────────────────────────────
  findAll(): Checkin[] {
    return this.checkins;
  }
}
