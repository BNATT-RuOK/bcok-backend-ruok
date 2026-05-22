import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';

// Omit contact_phone as we don't want to allow updating the contact_phone (it's part of the primary key)
export class UpdateContactDto extends PartialType(
  OmitType(CreateContactDto, ['contact_phone'] as const),
) {}
