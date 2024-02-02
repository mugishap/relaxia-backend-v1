import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsString, MaxLength, MinDate, MinLength } from "class-validator";

export class UpdateWorkExperienceDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    company: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(60)
    @ApiProperty()
    jobTitle: string;

    @IsDate()
    @ApiProperty()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    startDate: Date

    @IsDate()
    @ApiProperty()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    endDate: Date

    @IsArray()
    @ApiProperty()
    skills: string[]

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    @ApiProperty()
    description: string;
}