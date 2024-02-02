import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class UpdateSkillDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(15)
    @ApiProperty()
    name: string
    
}
