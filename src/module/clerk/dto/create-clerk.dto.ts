import { IsEmail, IsMongoId, IsNotEmpty, IsString, Length} from 'class-validator';

export class CreateClerkDto {

  @IsNotEmpty()
  @IsMongoId()
  aadharId!: string;

  @IsNotEmpty()
  @IsMongoId()
  officeDepartmentId!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
    password!: string;

  @IsNotEmpty()
  @IsString()
  employeeId!: string;

  @IsNotEmpty()
  @IsString()
  aadharCard!: string;

  @IsNotEmpty()
  @IsString()
  signature!: string;

  @IsNotEmpty()
  @IsString()
  govEmployeeIdCard!: string;
}