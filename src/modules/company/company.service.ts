import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { FileService } from '../file/file.service';
import { combineAll } from 'rxjs';
import { paginator } from 'src/pagination/paginator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompanyService {

    constructor(
        private prisma: PrismaService,
        private fileService: FileService,
        private configService: ConfigService
    ) { }

    async create(dto: CreateCompanyDTO) {
        const company = await this.prisma.company.create({
            data: {
                description: dto.description,
                name: dto.name,
                email: dto.email,
                location: dto.location,
                telephone: dto.telephone,
                website: dto.website
            }
        })
        return company;
    }
    async update(id: string, dto: UpdateCompanyDTO) {
        const company = await this.prisma.company.update({
            where: { id },
            data: {
                description: dto.description,
                name: dto.name,
                email: dto.email,
                location: dto.location,
                telephone: dto.telephone,
                website: dto.website
            },
            include: { logo: true }
        })
        return company;
    }
    async updateCompanyAvatar(id: string, fileObject: Express.Multer.File) {
        const file = await this.fileService.saveFile(fileObject);

        const company = await this.prisma.company.update({
            where: { id },
            data: {
                logo: {
                    connect: {
                        id: file.id
                    }
                },
            },
            include: {
                logo: true
            }
        })
        return company
    }

    async deleteCompany(id: string) {
        const company = await this.prisma.company.delete({
            where: { id }
        })
        return company
    }

    async getCompany(id: string) {
        const company = await this.prisma.company.findUnique({ where: { id }, include: { logo: true } })
        return company
    }

    async getCompanies(page: number, limit: number, search?: string) {
        const condition = search ? { name: { contains: search } } : {};
        const [companies, total] = await this.prisma.$transaction([
            this.prisma.company.findMany({
                where: condition,
                take: Number(limit),
                skip: page * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: { logo: true }
            }),
            this.prisma.company.count({ where: condition })
        ])
        return { companies, meta: paginator({ page: Number(page), limit: Number(limit), total }) };
    }

    async removeLogo(id: string) {
        const company = await this.prisma.company.findUnique({ where: { id }, include: { logo: true } })
        await this.fileService.deleteFile(company.logo.id, `${this.configService.get('PROFILE_FILES_PATH')}/${company.logo.name}`)
        return true
    }

}
