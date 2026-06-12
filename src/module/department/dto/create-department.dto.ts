 import { IsNotEmpty,  IsString, MaxLength } from 'class-validator';

export class CreateDepartmentDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name!: string;

}