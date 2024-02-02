import { HttpException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { EmploymentStatus, Prisma, Qualification } from '@prisma/client';
import { paginator } from 'src/pagination/paginator';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProfileService {

    constructor(
        private prisma: PrismaService,
        private fileService: FileService,
        private configService: ConfigService
    ) { }

    async createProfile(userId: string) {
        const profileExists = await this.prisma.profile.findUnique({ where: { userId } })
        if (profileExists) throw new HttpException("Profile already exists", 400)
        const profile = await this.prisma.profile.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        return profile
    }

    async updateProfile(userId: string, dto: UpdateProfileDTO) {
        const profile = await this.prisma.profile.update({
            where: {
                userId
            },
            data: {
                employmentStatus: dto.employmentStatus,
                facebook: dto.facebook,
                github: dto.github,
                linkedIn: dto.linkedIn,
                skills: {
                    connect: dto.skills.map(skill => ({ id: skill }))
                },
                portfolioWebsite: dto.portfolioWebsite,
                highestQualification: dto.highestQualification as Qualification,
                twitter: dto.twitter,
                workExperience: {
                    connect: dto.workExperience.map(experience => ({ id: experience }))
                }
            }
        })

        return profile
    }

    async getProfileByUserId(userId: string) {
        console.log(userId)
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                resume: true,
                skills: true,
                workExperience: true
            }
        })
        return profile;
    }

    async getProfileByProfileId(id: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id }
        })
        return profile;
    }

    async getProfiles(page: number, limit: number, skillIds: string[], highestQualification?: Qualification, employmentStatus?: EmploymentStatus) {
        const where: Prisma.ProfileWhereInput = {}
        if (skillIds) Object.assign(where, {
            skills: {
                some: {
                    id: skillIds
                }
            }
        })

        if (highestQualification) Object.assign(where, {
            highestQualification
        })

        if (employmentStatus) Object.assign(where, {
            employmentStatus
        })
        const [profiles, total] = await this.prisma.$transaction([
            this.prisma.profile.findMany({
                where,
                skip: page * limit,
                take: Number(limit)
            }),
            this.prisma.profile.count({ where })
        ]);
        return { profiles, meta: paginator({ page: Number(page), limit: Number(limit), total }) };
    }

    async deleteProfile(userId: string) {
        const profile = await this.prisma.profile.delete({
            where: {
                userId
            }
        })
        return profile
    }

    async uploadResume(userId: string, resume: Express.Multer.File) {
        const file = await this.fileService.saveFile(resume);
        const profile = await this.prisma.profile.update({
            where: {
                userId
            },
            data: {
                resume: {
                    connect: {
                        id: file.id
                    }
                },
            },
            include: {
                resume: true
            }
        })
        return profile
    }

    async removeResume(profileId: string) {
        const profile = await this.prisma.profile.findUnique({ where: { id: profileId }, include: { resume: true } })
        await this.fileService.deleteFile(profile.resumeId, `${this.configService.get('RESUMES_FILES_PATH')}/${profile.resume.name}`)
        return true
    }
}
