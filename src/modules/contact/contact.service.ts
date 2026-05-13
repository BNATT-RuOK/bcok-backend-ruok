import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(userId: number, dto: CreateContactDto) {
    const exists = await this.prisma.cONTACT.findUnique({
      where: {
        user_id_contact_phone: {
          user_id: userId,
          contact_phone: dto.contact_phone,
        },
      },
    });

    if (exists) {
      throw new ConflictException(`Contact with phone ${dto.contact_phone} already exists for this user`);
    }

    const contact = await this.prisma.cONTACT.create({
      data: {
        user_id: userId,
        contact_phone: dto.contact_phone,
        email: dto.email,
        contact_name: dto.contact_name,
        relationship: dto.relationship,
        expo_push_token: dto.expo_push_token,
      },
    });

    this.logger.log(`Created contact ${contact.contact_phone} for user #${userId}`);
    return contact;
  }

  async findAll(userId: number) {
    return this.prisma.cONTACT.findMany({
      where: { user_id: userId },
    });
  }

  async update(userId: number, contactPhone: string, dto: UpdateContactDto) {
    const contact = await this.prisma.cONTACT.findUnique({
      where: {
        user_id_contact_phone: {
          user_id: userId,
          contact_phone: contactPhone,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with phone ${contactPhone} not found for this user`);
    }

    const updated = await this.prisma.cONTACT.update({
      where: {
        user_id_contact_phone: {
          user_id: userId,
          contact_phone: contactPhone,
        },
      },
      data: {
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.contact_name !== undefined && { contact_name: dto.contact_name }),
        ...(dto.relationship !== undefined && { relationship: dto.relationship }),
        ...(dto.expo_push_token !== undefined && { expo_push_token: dto.expo_push_token }),
      },
    });

    this.logger.log(`Updated contact ${contactPhone} for user #${userId}`);
    return updated;
  }

  async remove(userId: number, contactPhone: string) {
    // Check if the contact exists
    const contact = await this.prisma.cONTACT.findUnique({
      where: {
        user_id_contact_phone: {
          user_id: userId,
          contact_phone: contactPhone,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with phone ${contactPhone} not found for this user`);
    }

    // Check how many contacts the user has left
    const totalContacts = await this.prisma.cONTACT.count({
      where: { user_id: userId },
    });

    if (totalContacts <= 1) {
      throw new BadRequestException('Cannot delete the only remaining contact. A user must have at least one contact.');
    }

    await this.prisma.cONTACT.delete({
      where: {
        user_id_contact_phone: {
          user_id: userId,
          contact_phone: contactPhone,
        },
      },
    });

    this.logger.log(`Deleted contact ${contactPhone} from user #${userId}`);
    return { message: `Contact ${contactPhone} deleted successfully` };
  }
}
