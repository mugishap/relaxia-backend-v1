import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { CompanyWorkerGuard } from 'src/guards/company-worker.guard';
import ServerResponse from 'src/utils/ServerResponse';
import { CreateSkillDTO } from './dto/create-skill.dto';
import { UpdateSkillDTO } from './dto/update-skll.dto';
import { SkillService } from './skill.service';

@Controller('skill')
@ApiTags('skills')
@ApiBearerAuth()
export class SkillController {

    constructor(
        private skillService: SkillService
    ) { }

    @Post("create")
    @UseGuards(CompanyWorkerGuard)
    async createSkill(
        @Body() dto: CreateSkillDTO
    ) {
        const skill = await this.skillService.createSkill(dto)
        return ServerResponse.success("Skill created successfully", { skill })
    }

    @Put("update/:id")
    @UseGuards(AdminGuard)
    async updateSkill(
        @Param("id") id: string,
        @Body() dto: UpdateSkillDTO
    ) {
        const skill = await this.skillService.updateSkill(id, dto)
        return ServerResponse.success("Skill updated successfully", { skill })
    }

    @Get("all")
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async getSkills(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
    ) {
        const skills = await this.skillService.getSkills(page, limit)
        return ServerResponse.success("Skills fetched successfully", { ...skills })
    }

    @Get(":id")
    @ApiParam({ name: "id", type: String })
    async getSkillById(
        @Param("id") id: string
    ) {
        const skill = await this.skillService.getSkillById(id)
        return ServerResponse.success("Skill fetched successfully", { skill })
    }

    @Get("search")
    @ApiQuery({ name: "query", type: String })
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async searchSkills(
        @Query("query") query: string,
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
    ) {
        const skills = await this.skillService.searchSkills(page, limit, query)
        return ServerResponse.success("Skills fetched successfully", { ...skills })
    }

    @Delete("delete/:id")
    @UseGuards(AdminGuard)
    @ApiParam({ name: "id", type: String })
    async deleteSkill(
        @Param("id") id: string
    ) {
        const skill = await this.skillService.deleteSkill(id)
        return ServerResponse.success("Skill deleted successfully", { skill })
    }

}
