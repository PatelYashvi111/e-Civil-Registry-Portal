import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyAadharDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12, {
    message: 'Aadhar number must be exactly 12 characters long',
  })
  aadharNumber!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, {
    message: 'OTP must be exactly 6 characters long',
  })
  otp!: string;
}