import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from "class-validator"

export class UpdateProfileDTO {

    @IsEnum(['PHD', 'MASTERS', 'BACHELORS', 'DIPLOMA', 'CERTIFICATE', 'OTHER'], { message: "Valid qualifications are ('PHD','MASTERS','BACHELORS','DIPLOMA','CERTIFICATE','OTHER') " })
    @IsOptional()
    @ApiProperty()
    highestQualification?: 'PHD' | 'MASTERS' | 'BACHELORS' | 'DIPLOMA' | 'CERTIFICATE' | 'OTHER'

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @ApiProperty()
    skills?: string[]

    @IsEnum(['EMPLOYED', 'UNEMPLOYED'], { message: "Employment statuses are ('EMPLOYED','UNEMPLOYED') " })
    @IsOptional()
    @ApiProperty()
    employmentStatus?: 'EMPLOYED' | 'UNEMPLOYED'

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @ApiProperty()
    workExperience?: string[];

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    linkedIn?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    github?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    twitter?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    facebook?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    portfolioWebsite?: string;
}