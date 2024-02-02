import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateQuestionDTO } from './dto/create-question.dto';
import ServerResponse from 'src/utils/ServerResponse';
import { AddAnswerDTO } from './dto/add-answer.dto';

@Controller('faq')
@ApiTags('faqs')
@ApiBearerAuth()
export class FaqController {

    constructor(
        private faqService: FaqService,
    ) { }

    @Post("create")
    async create(
        @Body() dto: CreateQuestionDTO
    ) {
        const question = await this.faqService.create(dto);
        return ServerResponse.success("Question created successfully", { question })
    }

    @Patch("add-answer")
    async addAnswer(
        @Body() dto: AddAnswerDTO
    ) {
        const question = await this.faqService.addAnswer(dto);
        return ServerResponse.success("Answer added successfully", { question })
    }

    @Get("all")
    @ApiQuery({ name: "page", required: false, example: 0, type: Number })
    @ApiQuery({ name: "page", required: false, example: 10, type: Number })
    async getQuestions(
        @Param('page') page: number = 0,
        @Param('limit') limit: number = 10
    ) {
        const questions = await this.faqService.getQuestions(page, limit);
        return ServerResponse.success("FAQs fetched successfully", { ...questions })
    }

}
