import { IsEmail, IsNotEmpty, IsOptional, IsString ,IsEnum, IsDateString, IsMongoId, Length } from 'class-validator';
import { StatusEnum } from '../../../common/enums/clerk.status.enums';

export class CreateUserDto {

  @IsNotEmpty()
  @IsMongoId()
  roleId!: string;

  @IsNotEmpty()
  @IsMongoId()
  aadharId!: string;

  @IsNotEmpty()
  @IsMongoId()
  districtId!: string;


  @IsNotEmpty()
  @IsMongoId()
  officeDepartmentId!: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  password!: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;

  @IsOptional()
  @IsDateString()
  lastAssignedAt?: Date;

  @IsOptional()
  @IsString()
  aadharCard?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  govEmployeeIdCard?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}