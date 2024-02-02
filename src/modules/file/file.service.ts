import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { promises as fsPromises } from 'fs';

@Injectable()
export class FileService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) { }

    async getFile(
        id: string) {
        const file = await this.prisma.file.findUnique({
            where: { id }
        });
        if (!file) throw new HttpException('File not found', 404);
        let filePath = '';
        if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
            filePath = `${process.env.PROFILE_FILES_PATH}/${file.name}`;
        } else {
            filePath = `${process.env.RESUMES_FILES_PATH}/${file.name}`;
        }
        try {
            const fileContent = await fsPromises.readFile(filePath);
            return { fileContent, file };
        } catch (error) {
            console.error(`Error reading file: ${error.message}`);
            throw new HttpException('Error reading file', 500);
        }
    }

    async saveFile(
        fileObject: Express.Multer.File
    ) {
        try {
            const { originalname, filename } = fileObject;
            const id = randomUUID()
            const file = await this.prisma.file.create({
                data: {
                    id,
                    name: filename,
                    originalName: originalname,
                    url: `${this.configService.get('SERVER_URL')}/api/v1/file/${id}`,
                    type: fileObject.mimetype
                }
            });
            return file;
        } catch (e) {
            console.log(e)
            throw new HttpException('Error saving file', 500);
        }
    }

    async deleteFile(
        id: string,
        filePath: string
    ) {
        const file = await this.prisma.file.findUnique({
            where: { id }
        });
        if (!file) return false;
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error('File does not exist');
            }
        }
        await this.prisma.file.delete({
            where: { id }
        });
        return true;
    }

}
