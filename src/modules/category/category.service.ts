import { Injectable } from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class CategoryService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(dto: CreateCategoryDTO) {
        const category = await this.prisma.category.create({
            data: {
                ...dto
            }
        });
        return category;
    }

    async update(id: string, dto: UpdateCategoryDTO) {
        const category = await this.prisma.category.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        });
        return category;
    }

    async delete(id: string) {
        const category = await this.prisma.category.delete({
            where: {
                id
            }
        });
        return category;
    }

    async findAll(page: number, limit: number, search?: string) {

        const where: Prisma.CategoryWhereInput = search ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        } : {};

        const [categorys, total] = await this.prisma.$transaction([
            this.prisma.category.findMany({
                where,
                skip: (page - 1) * limit,
                take: Number(limit)
            }),
            this.prisma.category.count({ where })
        ])
        return { categorys, meta: paginator({ page, limit, total }) };
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                id
            }
        });
        return category;
    }

}
