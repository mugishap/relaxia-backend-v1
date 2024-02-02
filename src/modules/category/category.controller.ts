import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanyWorkerGuard } from 'src/guards/company-worker.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Controller('category')
@UseGuards(CompanyWorkerGuard)
@ApiBearerAuth()
@ApiTags('categories')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post("create")
    async create(
        @Body() dto: CreateCategoryDTO
    ) {
        const category = await this.categoryService.create(dto);
        return ServerResponse.success("Category created successfully", { category });
    }

    @Put("update/:id")
    @ApiParam({ name: "id", required: true })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateCategoryDTO
    ) {
        const category = await this.categoryService.update(id, dto);
        return ServerResponse.success("Category updated successfully", { category });
    }

    @Delete("delete/:id")
    @ApiParam({ name: "id", required: true })
    async delete(
        @Param("id") id: string
    ) {
        const category = await this.categoryService.delete(id);
        return ServerResponse.success("Category deleted successfully", { category });
    }

    @Get("all")
    @ApiQuery({ name: "page", required: false, example: 0 })
    @ApiQuery({ name: "limit", required: false, example: 5 })
    @ApiQuery({ name: "search", required: false, example: "category" })
    async findAll(
        @Param("page") page: number,
        @Param("limit") limit: number,
        @Param("search") search?: string
    ) {
        const categories = await this.categoryService.findAll(page, limit, search);
        return ServerResponse.success("Categorys fetched successfully", { ...categories });
    }

    @Get("one/:id")
    @ApiParam({ name: "id", required: true })
    async findOne(
        @Param("id") id: string
    ) {
        const category = await this.categoryService.findOne(id);
        return ServerResponse.success("Category fetched successfully", { category });
    }

}
