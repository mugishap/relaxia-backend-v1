import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDTO } from './dto/create-application.dto';
import { paginator } from 'src/pagination/paginator';
import { Prisma } from '@prisma/client';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ApplicationService {

    constructor(
        private prisma: PrismaService,
        private profileService: ProfileService
    ) { }

    async createApplication(userId: string, dto: CreateApplicationDTO) {
        const profile = await this.profileService.getProfileByUserId(userId)
        const application = await this.prisma.application.create({
            data: {
                coverLetter: dto.coverLetter,
                job: {
                    connect: {
                        id: dto.jobId
                    }
                },
                profile: {
                    connect: {
                        id: profile.id
                    }
                }
            }
        })
        return application
    }

    async getJobApplicationsByJobId(page: number, limit: number, jobId: string) {
        const [applications, total] = await this.prisma.$transaction([
            this.prisma.application.findMany({
                where: {
                    jobId
                },
                include: {
                    profile: true
                },
                skip: (page - 1) * limit,
                take: Number(limit)
            }),
            this.prisma.application.count({
                where: {
                    jobId
                }
            })
        ])
        return { applications, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

    async getJobApplicationsByProfileId(page: number, limit: number, profileId: string) {
        const where: Prisma.ApplicationWhereInput = {
            profileId,
            status: "PENDING"
        }
        const [applications, total] = await this.prisma.$transaction([
            this.prisma.application.findMany({
                where,
                include: {
                    profile: true
                },
                skip: (page - 1) * limit,
                take: Number(limit)
            }),
            this.prisma.application.count({
                where
            })
        ])
        return { applications, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

    async withDrawApplication(userId: string, applicationId: string) {
        const _application = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { profile: true } })
        if (_application.profile.userId !== userId) throw new Error("You are not allowed to withdraw this application")
        const application = await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                status: 'WITHDRAWN'
            }
        })
        return application
    }

    async updateApplicationStatus(applicationId: string, status: "HIRED" | "INVITED" | "REJECTED") {
        const application = await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                status
            }
        })
        return application;
    }

    async getApplicationById(applicationId: string) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                profile: true,
                job: true
            }
        })
        return application
    }

    async getApplications(page: number, limit: number) {
        const [applications, total] = await this.prisma.$transaction([
            this.prisma.application.findMany({
                include: {
                    profile: true,
                    job: true
                },
                skip: (page - 1) * limit,
                take: Number(limit)
            }),
            this.prisma.application.count()
        ])
        return { applications, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

}
