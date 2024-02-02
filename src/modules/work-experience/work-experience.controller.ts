import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { WorkExperienceService } from './work-experience.service';
import { JobSeekerGuard } from 'src/guards/job-seeker.guard';
import { CreateWorkExperienceDTO } from './dto/create-work-experience.dto';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateWorkExperienceDTO } from './dto/update-work-experience.dto';

@Controller('work-experience')
@ApiTags('work-experiences')
@ApiBearerAuth()
export class WorkExperienceController {

    constructor(
        private workExperienceService: WorkExperienceService
    ) { }

    @Post("create")
    @UseGuards(JobSeekerGuard)
    async createWorkExperience(
        @Req() req: AuthRequest,
        @Body() dto: CreateWorkExperienceDTO
    ) {
        const workExperience = await this.workExperienceService.createWorkExperience(req.user.id, dto);
        return ServerResponse.success("Work experience created successfully", { workExperience })
    }

    @Put("update/:id")
    @ApiParam({ name: "id", type: String })
    @UseGuards(JobSeekerGuard)
    async updateWorkExperience(
        @Param("id") id: string,
        @Body() dto: UpdateWorkExperienceDTO
    ) {
        const workExperience = await this.workExperienceService.updateWorkExperience(id, dto);
        return ServerResponse.success("Work experience updated successfully", { workExperience })
    }

    @Delete("delete/:id")
    @ApiParam({ name: "id", type: String })
    @UseGuards(JobSeekerGuard)
    async deleteWorkExperience(
        @Param("id") id: string
    ) {
        const workExperience = await this.workExperienceService.deleteWorkExperience(id);
        return ServerResponse.success("Work experience deleted successfully", { workExperience })
    }

    @Get("by-profile/:id")
    @ApiParam({ name: "id", type: String })
    @UseGuards(JobSeekerGuard)
    async getWorkExperienceByProfile(
        @Param("id") id: string
    ) {
        const workExperience = await this.workExperienceService.getWorkExperienceByProfile(id);
        return ServerResponse.success("Experiences fetched successfuly", { workExperience })
    }

    @Get(":id")
    @ApiParam({ name: "id", type: String })
    @UseGuards(JobSeekerGuard)
    async getWorkExperienceById(
        @Param("id") id: string
    ) {
        const workExperience = await this.workExperienceService.getWorkExperienceById(id);
        return ServerResponse.success("Experiences fetched successfuly", { workExperience })
    }

}
