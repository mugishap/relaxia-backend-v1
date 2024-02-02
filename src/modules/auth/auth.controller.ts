import { Body, Controller, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import ServerResponse from 'src/utils/ServerResponse';
import { AuthRequest } from 'src/types';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@ApiTags("auth")
@ApiBearerAuth()
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("login")
    async login(@Body() dto: LoginDTO) {
        const response = await this.authService.login(dto);
        return ServerResponse.success("Login successful", { ...response });
    }

    @Patch("initiate-reset-password")
    async initiateResetPassword(@Body() dto: InitiateResetPasswordDTO) {
        await this.authService.initiateResetPassword(dto);
        return ServerResponse.success(`Password reset link has been sent to ${dto.email}`);
    }

    @Patch("reset-password")
    async resetPassword(@Body() dto: ResetPasswordDTO) {
        await this.authService.resetPassword(dto);
        return ServerResponse.success("Password reset successfully");
    }

    @Patch("initiate-email-verification")
    @UseGuards(AuthGuard)
    async initiateEmailVerification(@Req() req: AuthRequest) {
        await this.authService.initiateEmailVerification(req.user.id);
        return ServerResponse.success(`Verification code has been sent to your email`);
    }

    @Patch("verify-email/:code")
    @UseGuards(AuthGuard)
    async verifyEmail(@Param("code") code: string) {
        await this.authService.verifyEmail(code);
        return ServerResponse.success("Email verified successfully");
    }
}
