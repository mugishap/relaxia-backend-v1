import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanyWorkerGuard } from 'src/guards/company-worker.guard';
import { AuthRequest } from 'src/types';
import { CreateJobDTO } from './dto/create-job.dto';
import { Server } from 'http';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateJobDTO } from './dto/update-job.dto';
import { JobStatus, JobType, WorkEthic } from '@prisma/client';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('job')
@ApiTags('jobs')
@ApiBearerAuth()
export class JobController {

    constructor(
        private jobService: JobService
    ) { }

    @Post("create")
    @UseGuards(CompanyWorkerGuard)
    async createJob(
        @Req() req: AuthRequest,
        @Body() dto: CreateJobDTO
    ) {
        const job = await this.jobService.createJob(req.user.id, dto);
        return ServerResponse.success("Job created successfully", { job })
    }

    @Put("update/:id")
    @ApiParam({ name: "id", type: String })
    @UseGuards(CompanyWorkerGuard)
    async updateJob(
        @Param("id") jobId: string,
        @Body() dto: UpdateJobDTO
    ) {
        const job = await this.jobService.updateJob(jobId, dto);
        return ServerResponse.success("Job updated successfully", { job })
    }

    @Get("/all")
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: "companyId", type: String, required: false })
    @ApiQuery({ name: "skills", type: Array, required: false })
    @ApiQuery({ name: "workEthic", type: String, required: false })
    @ApiQuery({ name: "jobType", type: String, required: false })
    @ApiQuery({ name: "jobStatus", type: String, required: false })
    @ApiQuery({ name: "search", type: String, required: false })
    async getJobs(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
        @Query("companyId") companyId?: string,
        @Query("skills") skills?: string[],
        @Query("workEthic") workEthic?: WorkEthic,
        @Query("jobType") jobType?: JobType,
        @Query("jobStatus") jobStatus?: JobStatus,
        @Query("search") search?: string
    ) {
        const jobs = await this.jobService.getJobs(page, limit, companyId, skills, workEthic, jobType, jobStatus,search);
        return ServerResponse.success("Jobs retrieved successfully", { ...jobs })
    }

    @Get("by-creator/:creatorId")
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiParam({ name: "creatorId", required: true })
    @UseGuards(AdminGuard)
    async getJobsByCreator(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
        @Param("creatorId") creatorId: string
    ) {
        const jobs = await this.jobService.getJobsByCreator(page, limit, creatorId);
        return ServerResponse.success("Jobs fetched successfuly", { ...jobs })
    }

    @Get("by-company/:companyId")
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiParam({ name: "companyId", required: true })
    @UseGuards(AdminGuard)
    async getJobsByCompany(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
        @Param("companyId") companyId: string
    ) {
        const jobs = await this.jobService.getJobsByCompany(page, limit, companyId);
        return ServerResponse.success("Jobs fetched successfuly", { ...jobs })
    }


    @Delete(":id")
    @ApiParam({ name: "id", type: String, required: true })
    async deleteJob(
        @Param("id") id: string
    ) {
        const job = await this.jobService.deleteJob(id);
        return ServerResponse.success("Job deleted successfully", { job })
    }

}
