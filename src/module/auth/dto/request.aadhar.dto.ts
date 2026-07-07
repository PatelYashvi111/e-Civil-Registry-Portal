import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class RequestAadharDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12, {
    message: 'Aadhar number must be exactly 12 characters long',
  })
  aadharNumber!: string;

}