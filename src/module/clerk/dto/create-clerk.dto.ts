import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClerkDto {
  @IsNotEmpty()
  @IsMongoId()
  roleId!: string;

  @IsNotEmpty()
  @IsMongoId()
  aadharId!: string;

  @IsNotEmpty()
  @IsMongoId()
  officeDepartmentId!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  aadharCard?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  govEmployeeIdCard?: string;
}