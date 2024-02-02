import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from '../file/file.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ProfileService } from '../profile/profile.service';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private jwtService: JwtService,
        private fileService: FileService,
        private configService: ConfigService
    ) { }

    async create(dto: CreateUserDTO) {
        try {
            const hashedPassword = await hash(dto.password, 10)
            const user = await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hashedPassword
                }
            })
            await this.mailService.sendWelcomeEmail({ names: user.names, email: user.email })
            const token = await this.jwtService.sign({ id: user.id })
            return { user, token }
        }
        catch (error) {
            if (error.code === 'P2002') {
                const key = error.meta.target[0]
                throw new HttpException(`${key.charAt(0).toUpperCase() + key.slice(1)} (${dto[key]}) already exists`, 400);
            }
            throw error
        }
    }

    async update(id: string, dto: UpdateUserDTO) {
        try {
            const _user = await this.prisma.user.findUnique({ where: { id } })
            if (_user.email !== dto.email) await this.prisma.user.update({
                where: { id },
                data: {
                    ...dto,
                    verificationStatus: 'UNVERIFIED',
                }
            })
            else await this.prisma.user.update({
                where: { id },
                data: {
                    ...dto
                }
            })
            const user = await this.prisma.user.findUnique({
                where: { id }, include: {
                    profilePicture: true
                }
            })
            return user;
        }
        catch (error) {
            if (error.code === 'P2002') {
                const key = error.meta.target[0]
                throw new HttpException(`${key.charAt(0).toUpperCase() + key.slice(1)} (${dto[key]}) already exists`, 400);
            }
            throw error
        }
    }

    async assignToCompany(userId: string, companyId: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                company: {
                    connect: { id: companyId }
                }
            }
        })
        return user
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { profilePicture: true, profile: true }
        })
        return user
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email }, include: { profilePicture: true } })
        return user
    }

    async findByVerificationCode(code: string) {
        const user = await this.prisma.user.findFirst({ where: { verificationCode: code } })
        return user
    }

    async findByPasswordResetCode(code: string) {
        const user = await this.prisma.user.findFirst({ where: { passwordResetCode: code }, include: { profilePicture: true } })
        return user
    }

    async search(query: string) {
        const where: Prisma.UserWhereInput = {
            OR: [
                { names: { contains: query } },
                { email: { contains: query } },
                { telephone: { contains: query } },
            ]
        }
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                take: 10,
                skip: 0,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    names: true,
                    profilePicture: true
                },
            }),
            this.prisma.user.count({ where })
        ]);
        return { users, meta: paginator({ page: Number(0), limit: Number(10), total }) };
    }

    async findAll(page: number, limit: number, status?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING') {
        const condition = status ? { verificationStatus: status } : {};
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: condition,
                take: Number(limit),
                skip: page * limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.user.count({ where: condition })
        ])
        return { users, meta: paginator({ page: Number(page), limit: Number(limit), total }) };
    }

    async deleteUser(id: string) {
        const user = await this.prisma.user.delete({ where: { id } })
        return user
    }

    async updateAvatar(id: string, fileObject: Express.Multer.File) {
        const file = await this.fileService.saveFile(fileObject);

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                profilePicture: {
                    connect: {
                        id: file.id
                    }
                },
            },
            include: {
                profilePicture: true
            }
        })
        return user
    }

    async removeProfilePicture(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profilePicture: true } })
        if (!user.profilePicture) return false
        await this.fileService.deleteFile(user.profilePicture.id, `${this.configService.get('PROFILE_FILES_PATH')}/${user.profilePicture.name}`)
        return true
    }

}
