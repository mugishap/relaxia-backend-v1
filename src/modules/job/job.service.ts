import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { Currency, JobStatus, JobType, Payrate, Prisma, WorkEthic } from '@prisma/client';
import { distinct } from 'rxjs';
import { UpdateJobDTO } from './dto/update-job.dto';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class JobService {

    constructor(
        private prisma: PrismaService
    ) { }

    async createJob(createdById: string, dto: CreateJobDTO) {
        const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
        const user = await this.prisma.user.findUnique({ where: { id: createdById }, include: { company: true } });
        if (user.company.id !== company.id) throw new Error("You are not allowed to create job for this company")
        const job = await this.prisma.job.create({
            data: {
                title: dto.title,
                description: dto.description,
                applicationDeadline: dto.applicationDeadline,
                location: dto.location,
                salary: dto.salary,
                company: {
                    connect: {
                        id: user.companyId
                    }
                },
                benefits: {
                    connect: dto.benefits.map(benefit => ({ id: benefit }))

                },
                skills: {
                    connect: dto.skills.map(skill => ({ id: skill }))
                },
                payRate: dto.payRate,
                currency: dto.currency,
                type: dto.type,
                workEthic: dto.workEthic,
                status: dto.status,
                createdBy: {
                    connect: {
                        id: createdById
                    }
                },
                category: {
                    connect: {
                        id: dto.categoryId
                    }
                },
                tags: {
                    connect: dto.tagsIds.map(tag => ({ id: tag }))
                }
            },
            include: { company: true, category: true, skills: true, benefits: true }
        })

        return job;
    }

    async updateJob(id: string, dto: UpdateJobDTO) {
        const job = await this.prisma.job.update({
            where: {
                id
            },
            data: {
                title: dto.title,
                description: dto.description,
                applicationDeadline: dto.applicationDeadline,
                location: dto.location,
                salary: dto.salary,
                benefits: {
                    connect: dto.benefits.map(benefit => ({ id: benefit }))

                },
                skills: {
                    connect: dto.skills.map(skill => ({ id: skill }))
                },
                payRate: dto.payRate,
                currency: dto.currency,
                type: dto.type,
                workEthic: dto.workEthic,
                status: dto.status,
                category: {
                    connect: {
                        id: dto.categoryId
                    }
                },
                tags: {
                    connect: dto.tagsIds.map(tag => ({ id: tag }))
                }
            },
            include: { company: true, category: true, skills: true, benefits: true }
        })

        return job;
    }

    async getJobs(
        page: number,
        limit: number,
        companyId?: string,
        skills?: string[],
        workEthic?: WorkEthic,
        jobType?: JobType,
        jobStatus?: JobStatus,
        search?: string,
        category?: string,
        tag?: string,
    ) {
        const where: Prisma.JobWhereInput = {};

        if (companyId) where.companyId = companyId;

        if (skills && skills.length > 0) where.skills = { every: { name: { in: skills } } };

        if (workEthic) where.workEthic = workEthic;

        if (jobType) where.type = jobType;

        if (jobStatus) where.status = jobStatus;

        if (search) where.title = { contains: search }

        if (category) where.category = { name: category }

        if (tag) where.tags = { some: { name: tag } }

        const [jobs, total] = await this.prisma.$transaction([
            this.prisma.job.findMany({
                where,
                skip: page * limit,
                take: Number(limit),
                include: { company: { include: { logo: true } }, tags: true, category: true, skills: true, benefits: true },
            }),
            this.prisma.job.count({ where })
        ]);
        return { jobs, meta: paginator({ page: Number(page), limit: Number(limit), total }) };
    }

    async getJobById(jobId: string) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId }, include: { company: true, category: true, skills: true, benefits: true } })
        return job;
    }

    async getJobsByCompany(page: number, limit: number, companyId: string) {
        const where: Prisma.JobWhereInput = {
            companyId
        }
        const [jobs, total] = await this.prisma.$transaction([
            this.prisma.job.findMany({
                where,
                skip: page * limit,
                take: Number(limit),
                include: { company: true, category: true, skills: true, benefits: true }
            }),
            this.prisma.job.count({ where })
        ]);
        return { jobs, meta: paginator({ page: Number(page), limit: Number(limit), total }) };
    }

    async getJobsByCreator(page: number, limit: number, createdById: string) {
        const where: Prisma.JobWhereInput = {
            createdById
        }
        const [jobs, total] = await this.prisma.$transaction([
            this.prisma.job.findMany({
                where,
                skip: page * limit,
                take: Number(limit),
                include: { company: true, category: true, skills: true, benefits: true }
            }),
            this.prisma.job.count({ where })
        ]);
        return { jobs, meta: paginator({ page: Number(page), limit: Number(limit), total }) };
    }

    async deleteJob(id: string) {
        const job = await this.prisma.job.delete({
            where: { id },
            include: { company: true, category: true, skills: true, benefits: true }
        })
        return job;
    }
}
