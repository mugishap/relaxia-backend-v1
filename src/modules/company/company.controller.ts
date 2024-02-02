import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import ServerResponse from 'src/utils/ServerResponse';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { CompanyWorkerGuard } from 'src/guards/company-worker.guard';
import { AuthRequest } from 'src/types';
import appConfig from 'src/config/app.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserService } from '../user/user.service';

@Controller('company')
@ApiTags('companies')
@ApiBearerAuth()
export class CompanyController {

    constructor(
        private companyService: CompanyService,
        private userService: UserService
    ) { }

    @Post("create")
    async create(
        @Body() body: CreateCompanyDTO
    ) {
        const company = await this.companyService.create(body)
        return ServerResponse.success("Company created successfully", { company })
    }

    @Put("update/:id")
    @ApiParam({ name: "id", type: String })
    async update(
        @Param("id") id: string,
        @Body() body: UpdateCompanyDTO
    ) {
        const company = await this.companyService.update(id, body)
        return ServerResponse.success("Company updated successfully", { company })
    }

    @Get("all")
    @ApiQuery({ name: "search", type: String, required: false })
    @ApiQuery({ name: "page", type: Number, required: false, example: 0 })
    @ApiQuery({ name: "limit", type: Number, required: false, example: 10 })
    async getAllCompanies(
        @Query("search") search: string,
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 10,
    ) {
        const company = await this.companyService.getCompanies(page, limit, search)
        return ServerResponse.success("Company updated successfully", { ...company })
    }



    @Patch('/update-company-avatar/:id')
    @ApiParam({ name: 'id', type: String })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                logo: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('logo',
        {
            preservePath: true, fileFilter: (req, file, cb) => cb(null, true), storage: diskStorage({
                destination: "/opt/relaxia/uploads/profiles",
                filename: (req, file, cb) => {
                    const extension = file.originalname.split('.').pop();
                    const timestamp = Date.now();
                    const newName = `${file.originalname.replace(/\s/g, '_').split('.')[0]}-${timestamp}.${extension}`;
                    cb(null, newName);
                },
            }),
        },

    ))
    @UseGuards(CompanyWorkerGuard)
    async updateAvatar(
        @Req() req: AuthRequest,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: parseInt(appConfig().files.uploadLimit) }),
                    new FileTypeValidator({ fileType: new RegExp('image/*') }),
                ],
            }),
        ) logo: Express.Multer.File,
        @Param("id") companyId: string
    ) {
        const user = await this.userService.findById(req.user.id);
        if (user.companyId !== companyId) {
            return ServerResponse.error('You are not authorized to perform this action', null);
        }
        const logoExists = await this.companyService.getCompany(req.user.id)
        if (logoExists?.logoId) {
            await this.companyService.removeLogo(req.user.id)
        }
        const company = await this.companyService.updateCompanyAvatar(
            companyId,
            logo
        );
        return ServerResponse.success('Avatar updated successfully', { company });
    }

}
