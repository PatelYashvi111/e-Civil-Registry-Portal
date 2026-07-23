 import { IsNotEmpty,  IsString, MaxLength } from 'class-validator';

export class CreateDistrictDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name!: string;

  @IsString()
  @IsNotEmpty()
  stateId!: string;
  
}