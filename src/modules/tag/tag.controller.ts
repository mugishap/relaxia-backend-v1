import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanyWorkerGuard } from 'src/guards/company-worker.guard';
import { TagService } from './tag.service';
import { CreateTagDTO } from './dto/create-tag.dto';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateTagDTO } from './dto/update-tag.dto';

@Controller('tag')
@UseGuards(CompanyWorkerGuard)
@ApiBearerAuth()
@ApiTags('tags')
export class TagController {

    constructor(
        private readonly tagService: TagService
    ) { }

    @Post("create")
    async create(
        @Body() dto: CreateTagDTO
    ) {
        const tag = await this.tagService.create(dto);
        return ServerResponse.success("Tag created successfully", { tag });
    }

    @Put("update/:id")
    @ApiParam({ name: "id", required: true })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateTagDTO
    ) {
        const tag = await this.tagService.update(id, dto);
        return ServerResponse.success("Tag updated successfully", { tag });
    }

    @Delete("delete/:id")
    @ApiParam({ name: "id", required: true })
    async delete(
        @Param("id") id: string
    ) {
        const tag = await this.tagService.delete(id);
        return ServerResponse.success("Tag deleted successfully", { tag });
    }

    @Get("all")
    @ApiQuery({ name: "page", required: false, example: 0 })
    @ApiQuery({ name: "limit", required: false, example: 5 })
    @ApiQuery({ name: "search", required: false, example: "tag" })
    async findAll(
        @Param("page") page: number,
        @Param("limit") limit: number,
        @Param("search") search?: string
    ) {
        const tags = await this.tagService.findAll(page, limit, search);
        return ServerResponse.success("Tags fetched successfully", { ...tags });
    }

    @Get("one/:id")
    @ApiParam({ name: "id", required: true })
    async findOne(
        @Param("id") id: string
    ) {
        const tag = await this.tagService.findOne(id);
        return ServerResponse.success("Tag fetched successfully", { tag });
    }

}
