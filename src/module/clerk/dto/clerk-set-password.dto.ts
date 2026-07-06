import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ClerkSetPasswordDto {

  @IsNotEmpty()
  @IsString()
  verificationToken!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  confirmPassword!: 
}