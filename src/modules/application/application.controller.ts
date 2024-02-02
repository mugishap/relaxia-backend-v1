import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyWorkerGuard } from 'src/guards/company-worker.guard';
import { JobSeekerGuard } from 'src/guards/job-seeker.guard';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { ApplicationService } from './application.service';
import { CreateApplicationDTO } from './dto/create-application.dto';

@Controller('application')
@ApiTags('applications')
@ApiBearerAuth()
export class ApplicationController {

    constructor(
        private applicationService: ApplicationService
    ) { }

    @Post("create")
    @UseGuards(JobSeekerGuard)
    async createApplication(
        @Req() req: AuthRequest,
        @Body() dto: CreateApplicationDTO
    ) {
        const { id } = req.user
        const application = await this.applicationService.createApplication(id, dto)
        return ServerResponse.success("Application created successfully", { application })
    }

    @Get("job/:jobId")
    @UseGuards(CompanyWorkerGuard)
    @ApiQuery({ name: "page", type: Number, required: false, example: 0 })
    @ApiQuery({ name: "limit", type: Number, required: false, example: 10 })
    @ApiParam({ name: "jobId", type: String, required: true })
    async getJobApplicationsByJobId(
        @Param("jobId") jobId: string,
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10
    ) {
        const applications = await this.applicationService.getJobApplicationsByJobId(page, limit, jobId);
        return ServerResponse.success("Applications fetched successfully", { ...applications })
    }

    @Get("profile/:profileId")
    @UseGuards(JobSeekerGuard)
    @ApiQuery({ name: "page", type: Number, required: false, example: 0 })
    @ApiQuery({ name: "limit", type: Number, required: false, example: 10 })
    @ApiParam({ name: "profileId", type: String, required: true })
    async getJobApplicationsByProfileId(
        @Param("profileId") profileId: string,
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10
    ) {
        const applications = await this.applicationService.getJobApplicationsByProfileId(page, limit, profileId);
        return ServerResponse.success("Applications fetched successfully", { ...applications })
    }

    @Post("withdraw/:applicationId")
    @UseGuards(JobSeekerGuard)
    @ApiParam({ name: "applicationId", type: String, required: true })
    async withDrawApplication(
        @Req() req: AuthRequest,
        @Param("applicationId") applicationId: string
    ) {
        const { id } = req.user
        const application = await this.applicationService.withDrawApplication(id, applicationId)
        return ServerResponse.success("Application withdrawn successfully", { application })
    }

    @Put("update-status/:applicationId/:newStatus")
    @UseGuards(CompanyWorkerGuard)
    @ApiParam({ name: "applicationId", type: String, required: true })
    @ApiParam({ name: "newStatus", type: String, required: true })
    async updateApplicationStatus(
        @Param("applicationId") applicationId: string,
        @Param("newStatus") newStatus: "HIRED" | "INVITED" | "REJECTED"
    ) {
        const application = await this.applicationService.updateApplicationStatus(applicationId, newStatus)
        return ServerResponse.success("Application updated successfully", { application })
    }

    @Get("all")
    @ApiQuery({ name: "page", type: Number, required: false, example: 0 })
    @ApiQuery({ name: "limit", type: Number, required: false, example: 10 })
    async getApplications(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10
    ) {
        const applications = await this.applicationService.getApplications(page, limit)
        return ServerResponse.success("Applications fetched successfully", { ...applications })
    }

    @Get(":applicationId")
    @UseGuards(AuthGuard)
    @ApiParam({ name: "applicationId", type: String, required: true })
    async getApplicationById(
        @Param("applicationId") applicationId: string
    ) {
        const application = await this.applicationService.getApplicationById(applicationId)
        return ServerResponse.success("Application fetched successfully", { application })
    }

}
