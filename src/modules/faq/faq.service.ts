import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { AddAnswerDTO } from './dto/add-answer.dto';

@Injectable()
export class FaqService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(dto: CreateQuestionDTO) {
        return await this.prisma.faq.create({
            data: {
                question: dto.question,
            }
        })
    }

    async addAnswer(dto: AddAnswerDTO) {
        return await this.prisma.faq.create({
            data: {
                question: dto.answer,
            }
        })
    }

    async getQuestions(page: number, limit: number) {
        return await this.prisma.faq.findMany({
            skip: page * limit,
            take: Number(limit),
        })
    }

}
