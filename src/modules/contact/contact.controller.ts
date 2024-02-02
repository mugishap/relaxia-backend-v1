import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDTO } from './dto/create-contact.dto';
import ServerResponse from 'src/utils/ServerResponse';

@Controller('contact')
@ApiTags('contacts')
@ApiBearerAuth()
export class ContactController {

    constructor(
        private contactService: ContactService,
    ) { }

    @Post('create')
    async createContact(@Body() dto: CreateContactDTO) {
        const contact = await this.contactService.createContact(dto);
        return ServerResponse.success('Contact created successfully', { contact });
    }

    @Get('all')
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async getContacts(
        @Param('page') page: number = 0,
        @Param('limit') limit: number = 10,
    ) {
        const contacts = await this.contactService.getContacts(page, limit);
        return ServerResponse.success('Contact fetched successfully', { ...contacts });
    }
}
