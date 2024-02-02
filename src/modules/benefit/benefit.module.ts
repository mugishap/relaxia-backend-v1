import { Module } from '@nestjs/common';
import { BenefitController } from './benefit.controller';
import { BenefitService } from './benefit.service';

@Module({
  controllers: [BenefitController],
  providers: [BenefitService]
})
export class BenefitModule {}
