import { ApiProperty } from "@nestjs/swagger";
import { IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTagDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(30)
    @ApiProperty()
    name: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    color: string;

}