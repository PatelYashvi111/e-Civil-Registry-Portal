import { IsEmail, IsMongoId, IsNotEmpty, IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { StatusEnum } from '../../../common/enums/clerk.status.enums';

export class CreateClerkDto {

  @IsNotEmpty()
  @IsString()
  aadharNumber!: string;

  @IsNotEmpty()
  @IsMongoId()
  aadharId!: string;

  @IsNotEmpty()
  @IsMongoId()
  officeDepartmentId!: string;

  @IsNotEmpty()
  @IsMongoId()
  districtId!: string;

  // @IsNotEmpty()
  // @IsMongoId()
  // officeId!: string;

  // @IsNotEmpty()
  // @IsMongoId()
  // departmentId!: string;

  @IsNotEmpty()
  @IsString()
  roleId!: string;

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

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @IsNotEmpty()
  @IsString()
  aadharCard!: string;

  @IsNotEmpty()
  @IsString()
  signature!: string;

  @IsNotEmpty()
  @IsString()
  govEmployeeIdCard!: string;

  // @IsNotEmpty()
  // @IsString()
  // verificationToken!: string;

}

