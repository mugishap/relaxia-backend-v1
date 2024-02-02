import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule { }
