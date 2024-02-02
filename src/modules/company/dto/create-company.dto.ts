import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateCompanyDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    telephone: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    location: string

    @IsString()
    @IsOptional()
    website: string

    @IsString()
    @MaxLength(500)
    @MinLength(3)
    @ApiProperty()
    description: string
}