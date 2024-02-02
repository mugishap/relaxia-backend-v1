import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BenefitService } from './benefit.service';
import { CreateBenefitDTO } from './dto/create-benefit.dto';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateBenefitDTO } from './dto/update-benefit.dto';

@Controller('benefit')
@ApiTags('benefits')
@ApiBearerAuth()
export class BenefitController {

    constructor(
        private benefitService: BenefitService
    ) { }

    @Post("create")
    async createBenefit(
        @Body() dto: CreateBenefitDTO
    ) {
        const benefit = await this.benefitService.createBenefit(dto)
        return ServerResponse.success("Benefit created successfully", { benefit })
    }

    @Put("update/:id")
    @ApiParam({ name: "id", required: true })
    async updateBenefit(
        @Param("id") id: string,
        @Body() dto: UpdateBenefitDTO
    ) {
        const benefit = await this.benefitService.updateBenefit(id, dto);
        return ServerResponse.success("Benefit updated successfully", { benefit })
    }

    @Delete("delete/:id")
    @ApiParam({ name: "id", required: true })
    async deleteBenefit(
        @Param("id") id: string,
    ) {
        const benefit = await this.benefitService.deleteBenefit(id);
        return ServerResponse.success("Benefit deleted successfully", { benefit })
    }

    @Get("all")
    @ApiQuery({ name: 'page', required: false, example: 0 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: "search", type: String, required: false })
    async getAllBenefits(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
        @Query("search") search?: string
    ) {
        const benefits = await this.benefitService.getAllBenefits(page, limit, search);
        return ServerResponse.success("Benefits fetched successfully", { ...benefits })
    }

    @Get(":id")
    @ApiParam({ name: "id", required: true })
    async getBenefitById(
        @Param("id") id: string
    ) {
        const benefit = await this.benefitService.getBenefitById(id);
        return ServerResponse.success("Benefit fetched successfully", { benefit })
    }

}
