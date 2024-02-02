import { IsNotEmpty, IsString, Max, MaxLength, MinLength } from "class-validator";


export class AddAnswerDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(1000)
    answer: string;

}