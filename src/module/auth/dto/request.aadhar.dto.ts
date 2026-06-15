import { IsString, IsNotEmpty, Length } from "class-validator";

export class RequestAadharDto {

    @IsString()
    @IsNotEmpty()
    @Length(12, 12)
    aadharNumber!: string;

}