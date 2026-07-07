import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

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