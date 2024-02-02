import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDTO } from './dto/create-contact.dto';

@Injectable()
export class ContactService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async createContact(data: CreateContactDTO) {
        return await this.prisma.contact.create({
            data: {
                ...data,
            }
        })
    }

    async getContacts(page: number, limit: number) {
        return await this.prisma.contact.findMany({
            skip: page * limit,
            take: Number(limit),
        })
    }

}
