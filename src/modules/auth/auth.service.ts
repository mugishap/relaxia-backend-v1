import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import ServerResponse from 'src/utils/ServerResponse';
import { UserService } from './../user/user.service';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { LoginDTO } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private mailService: MailService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }

    async login(dto: LoginDTO) {
        const user = await this.userService.findByEmail(dto.email)
        if (!user) throw new HttpException("Invalid email or password", 400)
        const match = compareSync(dto.password, user.password)
        if (!match) throw new HttpException("Invalid email or password", 400)
        const token = this.jwtService.sign({ id: user.id })
        return { token, user }
    }


    async initiateResetPassword(dto: InitiateResetPasswordDTO) {
        try {
            const user = await this.userService.findByEmail(dto.email);
            if (!user) throw new HttpException("Invalid email address", 400);
            if (user.passwordResetStatus === "PENDING") throw new HttpException("Password Reset code already sent", 400);
            const passwordResetCode = Math.floor(100000 + Math.random() * 900000).toString();
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    passwordResetCode,
                    passwordResetExpires: new Date(Date.now() + 600000),
                    passwordResetStatus: "PENDING"
                }
            })

            await this.mailService.sendInitiatePasswordResetEmail({ names: user.names, email: user.email, token: passwordResetCode })
            return user.email
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(dto: ResetPasswordDTO) {
        try {
            const user = await this.userService.findByPasswordResetCode(dto.code);
            if (!user) throw new HttpException("Invalid code", 400);
            if (user.passwordResetExpires < new Date()) throw new HttpException("Password reset code expired", 400);
            const hashedPassword = await hash(dto.password, 10);
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword,
                    passwordResetCode: null,
                    passwordResetExpires: null,
                    passwordResetStatus: "IDLE"
                }
            })

            await this.mailService.sendPasswordResetSuccessfulEmail({ names: user.names, email: user.email })
            return true
        } catch (error) {
            throw error;
        }
    }

    async initiateEmailVerification(id: string) {
        try {
            const user = await this.userService.findById(id);
            console.log(user)
            if (user.verificationStatus === "PENDING" && user.verificationExpires > new Date()) throw new HttpException("Verification code already sent", 400);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
            await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    verificationCode,
                    verificationExpires: new Date(Date.now() + 600000),
                    verificationStatus: "PENDING"
                }
            })

            await this.mailService.sendInitiateEmailVerificationEmail({ names: user.names, email: user.email, verificationCode })
            return user.email
        } catch (error) {
            throw error;
        }
    }

    async verifyEmail(code: string) {
        try {
            const user = await this.userService.findByVerificationCode(code);
            if (!user) throw new HttpException("Invalid code", 400);
            if (user.verificationExpires < new Date()) throw new HttpException("Verification code expired", 400);

            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    verificationStatus: "VERIFIED",
                    verificationCode: null,
                    verificationExpires: null
                }
            })
            await this.mailService.sendEmailVerificationSuccessfulEmail({ names: user.names, email: user.email })
            return true;
        } catch (error) {
            throw error;
        }
    }

}
