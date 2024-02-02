import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmploymentStatus, Qualification } from '@prisma/client';
import { diskStorage } from 'multer';
import appConfig from 'src/config/app.config';
import { JobSeekerGuard } from 'src/guards/job-seeker.guard';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('profiles')
@ApiBearerAuth()
export class ProfileController {

    constructor(
        private profileService: ProfileService
    ) { }

    @Post("/create")
    @UseGuards(JobSeekerGuard)
    async createProfile(
        @Req() req: AuthRequest
    ) {
        const profile = await this.profileService.createProfile(req.user.id);
        return ServerResponse.success("Profile created successfully", { profile })
    }

    @Put("/update")
    async updateProfile(
        @Req() req: AuthRequest,
        @Body() dto: UpdateProfileDTO
    ) {
        const profile = await this.profileService.updateProfile(req.user.id, dto);
        return ServerResponse.success("Profile updated successfully", { profile })
    }

    @Put("/upload-resume")
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                resume: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('resume',
        {
            preservePath: true, fileFilter: (req, file, cb) => cb(null, true), storage: diskStorage({
                destination: "/opt/relaxia/uploads/resumes",
                filename: (req, file, cb) => {
                    const extension = file.originalname.split('.').pop();
                    const timestamp = Date.now();
                    const newName = `${file.originalname.replace(/\s/g, '_').split('.')[0]}-${timestamp}.${extension}`;
                    cb(null, newName);
                },
            }),
        },

    ))
    @UseGuards(JobSeekerGuard)
    async uploadProfileResume(
        @Req() req: AuthRequest,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: parseInt(appConfig().files.uploadLimit) }),
                    new FileTypeValidator({ fileType: new RegExp('application/pdf') }),
                ],
            }),
        ) resume: Express.Multer.File
    ) {
        const { resume: resumeExists } = await this.profileService.getProfileByUserId(req.user.id)
        if (resumeExists) {
            await this.profileService.removeResume(req.user.id)
        }
        const user = await this.profileService.uploadResume(
            req.user.id,
            resume
        );
        return ServerResponse.success('Resume updated successfully', { user });
    }

    @Get("/by-user/:userId")
    @ApiParam({ name: 'userId', type: String })
    async getProfileByUserId(
        @Param("userId") userId: string
    ) {
        const profile = await this.profileService.getProfileByUserId(userId);
        return ServerResponse.success("Profile retrieved successfully", { profile })
    }

    @Get("my-profile")
    @UseGuards(JobSeekerGuard)
    async getMyProfile(
        @Req() req: AuthRequest
    ) {
        const profile = await this.profileService.getProfileByUserId(req.user.id);
        return ServerResponse.success("Profile fetched successfully", { profile })
    }

    @Get(":profileId")
    @ApiParam({ name: 'profileId', type: String })
    async getProfileByProfileId(
        @Param("profileId") profileId: string
    ) {
        const profile = await this.profileService.getProfileByProfileId(profileId);
        return ServerResponse.success("Profile retrieved successfully", { profile })
    }

    @Get("/all")
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: "skillId", type: String, required: false })
    @ApiQuery({ name: "highestQualification", type: String, required: false })
    @ApiQuery({ name: "employmentStatus", type: String, required: false })
    async getProfiles(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
        @Query("skillIds") skillIds?: string[],
        @Query("highestQualification") highestQualification?: Qualification,
        @Query("employmentStatus") employmentStatus?: EmploymentStatus
    ) {
        const profiles = await this.profileService.getProfiles(page, limit, skillIds, highestQualification, employmentStatus);
        return ServerResponse.success("Profiles retrieved successfully", { ...profiles })
    }

    @Delete(":id")
    @ApiParam({ name: 'id', type: String })
    async deleteProfile(
        @Param("id") id: string
    ) {
        const profile = await this.profileService.deleteProfile(id);
        return ServerResponse.success("Profile deleted successfully", { ...profile })
    }

    @Delete("/remove-resume")
    @UseGuards(JobSeekerGuard)
    async removeResume(
        @Req() req: AuthRequest
    ) {
        const { id } = await this.profileService.getProfileByUserId(req.user.id)
        const profile = await this.profileService.removeResume(id);
        return ServerResponse.success("Resume removed successfully", { profile })
    }

}
