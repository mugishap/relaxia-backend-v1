import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBenefitDTO } from './dto/update-benefit.dto';
import { CreateBenefitDTO } from './dto/create-benefit.dto';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class BenefitService {

    constructor(
        private prisma: PrismaService
    ) { }

    async createBenefit(dto: CreateBenefitDTO) {
        const benefit = await this.prisma.benefit.create({
            data: {
                ...dto
            }
        })
        return benefit
    }

    async updateBenefit(id: string, dto: UpdateBenefitDTO) {
        const benefit = await this.prisma.benefit.update({
            where: { id },
            data: {
                ...dto
            }
        })
        return benefit
    }

    async deleteBenefit(id: string) {
        const benefit = await this.prisma.benefit.delete({
            where: { id }
        })
        return benefit
    }

    async getBenefitById(id: string) {
        const benefit = await this.prisma.benefit.findUnique({
            where: { id }
        })
        return benefit
    }

    async getAllBenefits(page: number, limit: number, search?: string) {
        const where: Prisma.BenefitWhereInput = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
            ]
        } : {}

        const [benefits, total] = await this.prisma.$transaction([
            this.prisma.benefit.findMany({
                where,
                take: Number(limit),
                skip: page * limit
            }),
            this.prisma.benefit.count({ where })
        ])
        
        return { benefits, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

}
