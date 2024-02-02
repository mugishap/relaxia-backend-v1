import { Injectable } from '@nestjs/common';
import { CreateTagDTO } from './dto/create-tag.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class TagService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(dto: CreateTagDTO) {
        const tag = await this.prisma.tag.create({
            data: {
                ...dto
            }
        });
        return tag;
    }

    async update(id: string, dto: UpdateTagDTO) {
        const tag = await this.prisma.tag.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        });
        return tag;
    }

    async delete(id: string) {
        const tag = await this.prisma.tag.delete({
            where: {
                id
            }
        });
        return tag;
    }

    async findAll(page: number, limit: number, search?: string) {

        const where: Prisma.TagWhereInput = search ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        } : {};

        const [tags, total] = await this.prisma.$transaction([
            this.prisma.tag.findMany({
                where,
                skip: (page - 1) * limit,
                take: Number(limit)
            }),
            this.prisma.tag.count({ where })
        ])
        return { tags, meta: paginator({ page, limit, total }) };
    }

    async findOne(id: string) {
        const tag = await this.prisma.tag.findUnique({
            where: {
                id
            }
        });
        return tag;
    }

}
