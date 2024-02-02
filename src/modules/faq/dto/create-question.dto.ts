import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class CreateQuestionDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(400)
    question: string;

}