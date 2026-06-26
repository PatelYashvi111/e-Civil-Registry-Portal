import { IsEmail, IsNotEmpty, IsString, Length} from 'class-validator';

export class ResetPasswordDto{

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    otp!: string;

    @IsString()
    @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
   })
    password!: string;

    @IsString()
    @Length(8, 20, {
    message: 'Confirm password must be between 8 and 20 characters long',
    })
    confirmPassword!: string;

}

