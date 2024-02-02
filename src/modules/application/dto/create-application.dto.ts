import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateApplicationDTO {

    @IsUUID()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    jobId: string

    @IsString()
    @MinLength(0)
    @MaxLength(500)
    @ApiProperty()
    coverLetter?: string
}