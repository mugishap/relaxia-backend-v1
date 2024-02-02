import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTagDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(30)
    @ApiProperty()
    name: string;

}