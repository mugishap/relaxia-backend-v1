import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDTO } from './dto/create-admin.dto';

@Injectable()
export class AdminService {

    constructor(
        private prisma: PrismaService
    ) { }

    async getStats() {
        const users = await this.prisma.user.count();
        const jobs = await this.prisma.job.count();
        const applications = await this.prisma.application.count();
        const skills = await this.prisma.skill.count();
        const companies = await this.prisma.company.count();
        const profiles = await this.prisma.profile.count();
        const benefits = await this.prisma.benefit.count();
        const contacts = await this.prisma.contact.count();
        const faqs = await this.prisma.faq.count();
        const files = await this.prisma.file.count();

        return { users, jobs, applications, skills, companies, profiles, benefits, contacts, faqs, files }
    }

    async createAdmin(dto: CreateAdminDTO) {
        const admin = await this.prisma.user.create({
            data: {
                ...dto,
                role: "ADMIN"
            }
        });
        return admin;
    }

}
