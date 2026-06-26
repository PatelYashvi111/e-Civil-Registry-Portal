import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOfficeDepartmentDto {
    @IsString()
    @IsNotEmpty()
    officeId!: string;
    
    @IsString()
    @IsNotEmpty()
    departmentId!: string;
  }
