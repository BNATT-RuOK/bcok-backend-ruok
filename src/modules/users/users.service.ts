import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) { }

  // ── CREATE ─────────────────────────────────────────────────────────────────
  async create(dto: CreateUserDto) {
    // Kiểm tra email đã tồn tại chưa
    const exists = await this.prisma.uSER.findFirst({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException(`Email "${dto.email}" is already registered`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Tạo user mới và contact trong một database transaction để đảm bảo tính nguyên tử (atomic)
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.uSER.create({
        data: {
          email: dto.email,
          password_hash: hashedPassword,
          full_name: dto.full_name,
        },
      });

      if (dto.phone_number) {
        // Kiểm tra xem contact đã tồn tại chưa trước khi tạo
        const contactExists = await tx.cONTACT.findUnique({
          where: {
            user_id_contact_phone: {
              user_id: newUser.user_id,
              contact_phone: dto.phone_number,
            },
          },
        });

        if (!contactExists) {
          await tx.cONTACT.create({
            data: {
              user_id: newUser.user_id,
              contact_phone: dto.phone_number,
            },
          });
        }
      }

      return newUser;
    });

    this.logger.log(`Created user #${user.user_id} – ${user.full_name}`);

    return user;
  }

  // ── READ ALL ───────────────────────────────────────────────────────────────
  async findAll() {
    return this.prisma.uSER.findMany({
      orderBy: { created_at: 'desc' },
      // Không trả về password_hash
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone_number: true,
        checkin_interval_mins: true,
        sos_timeout_mins: true,
        created_at: true,
      },
    });
  }

  // ── READ ONE ───────────────────────────────────────────────────────────────
  async findOne(id: number) {
    const user = await this.prisma.uSER.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone_number: true,
        checkin_interval_mins: true,
        sos_timeout_mins: true,
        created_at: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  // ── FIND BY EMAIL (dùng cho AuthService) ──────────────────────────────────
  // Hàm này trả về cả password_hash để AuthService so sánh mật khẩu
  async findByEmail(email: string) {
    return this.prisma.uSER.findFirst({
      where: { email },
    });
  }

  // ── UPDATE ─────────────────────────────────────────────────────────────────
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id); // Kiểm tra user tồn tại

    const updated = await this.prisma.uSER.update({
      where: { user_id: id },
      data: {
        ...(dto.full_name && { full_name: dto.full_name }),
        ...(dto.phone_number && { phone_number: dto.phone_number }),
        ...(dto.checkin_interval_mins !== undefined && {
          checkin_interval_mins: dto.checkin_interval_mins,
        }),
        ...(dto.sos_timeout_mins !== undefined && {
          sos_timeout_mins: dto.sos_timeout_mins,
        }),
      },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone_number: true,
        checkin_interval_mins: true,
        sos_timeout_mins: true,
        created_at: true,
      },
    });

    this.logger.log(`Updated user #${id}`);
    return updated;
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  async remove(id: number) {
    await this.findOne(id); // Kiểm tra user tồn tại

    await this.prisma.uSER.delete({ where: { user_id: id } });
    this.logger.log(`Deleted user #${id}`);
    return { message: `User #${id} deleted successfully` };
  }
}
