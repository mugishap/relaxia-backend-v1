import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min, MinDate, MinLength } from "class-validator";

export class CreateJobDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(60)
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    @ApiProperty()
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    location: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty()
    salary: number;

    @IsEnum(['RWF', 'USD', 'PLN', 'EUR', 'GBP'], { message: "Currency should be RWF, USD, PLN, EUR, GBP" })
    @IsNotEmpty()
    @ApiProperty()
    currency: 'RWF' | 'USD' | 'PLN' | 'EUR' | 'GBP'

    @IsEnum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'], { message: "Pay rate should be HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY" })
    @IsNotEmpty()
    @ApiProperty()
    payRate: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

    @IsArray()
    @ApiProperty()
    skills: string[]

    @IsArray()
    @ApiProperty()
    benefits: string[]

    @IsDate()
    @ApiProperty()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    applicationDeadline: Date

    @IsEnum(['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY'], { message: "Job type should be FULLTIME, PARTTIME, CONTRACT, INTERNSHIP, TEMPORARY" })
    @IsNotEmpty()
    @ApiProperty()
    type: 'FULLTIME' | 'PARTTIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY'

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    companyId: string;

    @IsEnum(['ACTIVE', 'INACTIVE'], { message: "Job status should be  ACTIVE, INACTIVE" })
    @IsNotEmpty()
    @ApiProperty()
    status: 'ACTIVE' | 'INACTIVE'

    @IsEnum(['REMOTE', 'ONSITE', 'HYBRID', 'DOESNT_MATTER'], { message: "Work ethic should be REMOTE, ONSITE, HYBRID, DOESNT_MATTER" })
    @IsNotEmpty()
    @ApiProperty()
    workEthic: 'REMOTE' | 'ONSITE' | 'HYBRID' | 'DOESNT_MATTER'

    @Optional()
    @ApiProperty()
    @IsArray()
    @IsUUID("4", { each: true })
    @Max(3, { message: "You can only select up to 3 tags" })
    tagsIds?: string[]

    @IsUUID()
    @Optional()
    @ApiProperty()
    categoryId?: string
}