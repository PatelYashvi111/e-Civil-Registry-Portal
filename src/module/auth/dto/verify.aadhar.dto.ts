import { IsString, IsNotEmpty, Length } from "class-validator";

export class VerifyAadharDto {

    @IsString()
    @IsNotEmpty()
    @Length(12, 12)
    aadharNumber!: string;

    @IsString()
    @IsNotEmpty()
    @Length(6,6)
    otp!: string;
}