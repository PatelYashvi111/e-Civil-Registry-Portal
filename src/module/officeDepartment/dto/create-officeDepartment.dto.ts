import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateOfficeDepartmentDto {

    @IsNotEmpty()
    @IsMongoId()
    officeId!: string;
    
    @IsNotEmpty()
    @IsMongoId()
    departmentId!: string;
  }
