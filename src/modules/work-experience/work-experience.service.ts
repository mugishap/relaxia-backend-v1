import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkExperienceDTO } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDTO } from './dto/update-work-experience.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class WorkExperienceService {

    constructor(
        private prisma: PrismaService,
        private userService: UserService
    ) { }

    async createWorkExperience(createdById: string, dto: CreateWorkExperienceDTO) {
        const { profile } = await this.userService.findById(createdById);
        const workExperience = await this.prisma.workExperience.create({
            data: {
                company: dto.company,
                description: dto.description,
                profile: {
                    connect: {
                        id: profile.id
                    }
                },
                endDate: dto.endDate,
                startDate: dto.startDate,
                jobTitle: dto.jobTitle,
                skills: {
                    connect: dto.skills.map(skill => ({ id: skill }))
                }
            }
        })
        return workExperience;
    }

    async updateWorkExperience(id: string, dto: UpdateWorkExperienceDTO) {
        const workExperience = await this.prisma.workExperience.update({
            where: {
                id
            },
            data: {
                company: dto.company,
                description: dto.description,
                endDate: dto.endDate,
                startDate: dto.startDate,
                jobTitle: dto.jobTitle,
                skills: {
                    connect: dto.skills.map(skill => ({ id: skill }))
                }
            }
        })
        return workExperience;
    }

    async deleteWorkExperience(id: string) {
        const workExperience = await this.prisma.workExperience.delete({ where: { id } })
        return workExperience;
    }


    async getWorkExperienceByProfile(profileId: string) {
        const workExperiences = await this.prisma.workExperience.findMany({
            where: {
                profileId
            }
        })
        return workExperiences;
    }

    async getWorkExperienceById(id: string) {
        const workExperience = await this.prisma.workExperience.findUnique({
            where: {
                id
            }
        })
        return workExperience;
    }
}
