import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  otp!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Confirm password must be between 8 and 20 characters long',
  })
  confirmPassword!: string;
}