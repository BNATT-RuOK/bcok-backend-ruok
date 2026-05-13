import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post()
  @ApiOperation({ summary: 'Add a new emergency contact for the user' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, description: 'Contact created successfully.' })
  @ApiResponse({ status: 409, description: 'Contact with this phone already exists.' })
  create(@Req() req: any, @Body() dto: CreateContactDto) {
    const userId = req.user.userId;
    return this.contactService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all emergency contacts of the current user' })
  @ApiResponse({ status: 200, description: 'List of contacts returned.' })
  findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.contactService.findAll(userId);
  }

  @Put(':phone')
  @ApiOperation({ summary: 'Update an existing contact by phone number' })
  @ApiParam({ name: 'phone', description: 'Contact phone number' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ status: 200, description: 'Contact updated successfully.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  update(
    @Req() req: any,
    @Param('phone') phone: string,
    @Body() dto: UpdateContactDto,
  ) {
    const userId = req.user.userId;
    return this.contactService.update(userId, phone, dto);
  }

  @Delete(':phone')
  @ApiOperation({ summary: 'Delete an existing contact by phone number' })
  @ApiParam({ name: 'phone', description: 'Contact phone number' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot delete the only remaining contact.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  remove(@Req() req: any, @Param('phone') phone: string) {
    const userId = req.user.userId;
    return this.contactService.remove(userId, phone);
  }
}
