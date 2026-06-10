import { IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateUserDto {

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  aadharId?: string;

  
  @IsOptional()
  @IsString()
  officeDepartmentId?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  lastLoginAt?: Date;

  @IsOptional()
  lastAssignedAt?: Date;

  @IsOptional()
  @IsString()
  aadharCard?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  govEmployeIdCard?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}