import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateEmergencyDto, EmergencyStatus } from './dto/create-emergency.dto';
import { Emergency } from './entities/emergency.entity';

@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);

  // ── In-memory store with seed data ────────────────────────────────────────
  private emergencies: Emergency[] = [
    {
      id: 1,
      userId: 1,
      location: '10.7769,106.7009',
      status: EmergencyStatus.RESOLVED,
      timestamp: '2025-03-10T14:22:00.000Z',
      createdAt: new Date('2025-03-10T14:22:00Z').toISOString(),
    },
    {
      id: 2,
      userId: 2,
      location: '21.0285,105.8542',
      status: EmergencyStatus.SOS,
      timestamp: '2025-04-17T08:05:00.000Z',
      createdAt: new Date('2025-04-17T08:05:00Z').toISOString(),
    },
  ];

  private nextId = 3;

  // ── CREATE ─────────────────────────────────────────────────────────────────
  create(dto: CreateEmergencyDto): Emergency {
    const emergency: Emergency = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.emergencies.push(emergency);
    this.logger.warn(`🆘 New SOS alert #${emergency.id} from user #${dto.userId} at ${dto.location}`);
    return emergency;
  }

  // ── READ ALL ───────────────────────────────────────────────────────────────
  findAll(): Emergency[] {
    return this.emergencies;
  }

  // ── READ ONE ───────────────────────────────────────────────────────────────
  findOne(id: number): Emergency {
    const emergency = this.emergencies.find((e) => e.id === id);
    if (!emergency) {
      throw new NotFoundException(`Emergency alert #${id} not found`);
    }
    return emergency;
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  remove(id: number): { message: string } {
    const index = this.emergencies.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Emergency alert #${id} not found`);
    }
    this.emergencies.splice(index, 1);
    this.logger.log(`Removed emergency alert #${id}`);
    return { message: `Emergency alert #${id} deleted successfully` };
  }
}
