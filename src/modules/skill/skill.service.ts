import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDTO } from './dto/create-skill.dto';
import { UpdateSkillDTO } from './dto/update-skll.dto';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class SkillService {

    constructor(
        private prisma: PrismaService
    ) { }

    async createSkill(dto: CreateSkillDTO) {
        const skill = await this.prisma.skill.create({
            data: {
                ...dto
            }
        })
        return skill
    }
    async updateSkill(id: string, dto: UpdateSkillDTO) {
        const skill = await this.prisma.skill.update({
            where: { id },
            data: {
                ...dto
            }
        })
        return skill
    }
    async getSkillById(id: string) {
        const skill = await this.prisma.skill.findUnique({
            where: { id }
        })
        return skill
    }
    async getSkills(page: number, limit: number) {

        const [skills, total] = await this.prisma.$transaction([
            this.prisma.skill.findMany({
                skip: page * limit,
                take: Number(limit),
            }),
            this.prisma.skill.count()
        ])
        return { skills, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

    async searchSkills(page: number, limit: number, query: string) {
        const [skills, total] = await this.prisma.$transaction([
            this.prisma.skill.findMany({
                skip: page * limit,
                take: Number(limit),
                where: {
                    name: {
                        contains: query
                    }
                }
            }),
            this.prisma.skill.count({
                where: {
                    name: {
                        contains: query
                    }
                }
            })
        ])
        return { skills, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

    async deleteSkill(id: string) {
        const skill = await this.prisma.skill.delete({
            where: { id }
        })
        return skill
    }

}
