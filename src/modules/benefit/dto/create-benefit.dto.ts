import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBenefitDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(60)
    @ApiProperty()
    name: string;
    
}