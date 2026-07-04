import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  aadharNumber!: string;

  @IsNotEmpty()
  @IsString()
  verificationToken!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  password!: string;
}