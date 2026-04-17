import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // ── In-memory store with seed data ────────────────────────────────────────
  private users: User[] = [
    {
      id: 1,
      name: 'Nguyen Van An',
      email: 'van.an@example.com',
      phone: '0901234567',
      createdAt: new Date('2025-01-10T08:00:00Z').toISOString(),
    },
    {
      id: 2,
      name: 'Tran Thi Bich',
      email: 'thi.bich@example.com',
      phone: '0912345678',
      createdAt: new Date('2025-01-15T10:30:00Z').toISOString(),
    },
    {
      id: 3,
      name: 'Le Minh Duc',
      email: 'minh.duc@example.com',
      phone: '0923456789',
      createdAt: new Date('2025-02-01T09:15:00Z').toISOString(),
    },
  ];

  private nextId = 4;

  // ── CREATE ─────────────────────────────────────────────────────────────────
  create(dto: CreateUserDto): User {
    const exists = this.users.find((u) => u.email === dto.email);
    if (exists) {
      throw new ConflictException(`Email "${dto.email}" is already registered`);
    }
    const user: User = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.logger.log(`Created user #${user.id} – ${user.name}`);
    return user;
  }

  // ── READ ALL ───────────────────────────────────────────────────────────────
  findAll(): User[] {
    return this.users;
  }

  // ── READ ONE ───────────────────────────────────────────────────────────────
  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  // ── UPDATE ─────────────────────────────────────────────────────────────────
  update(id: number, dto: UpdateUserDto): User {
    const user = this.findOne(id);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    this.logger.log(`Updated user #${id}`);
    return user;
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  remove(id: number): { message: string } {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.users.splice(index, 1);
    this.logger.log(`Deleted user #${id}`);
    return { message: `User #${id} deleted successfully` };
  }
}
