 import { IsNotEmpty,  IsString, MaxLength, IsMongoId } from 'class-validator';

export class CreateDistrictDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name!: string;

  @IsNotEmpty()
  @IsMongoId()
  stateId!: string;
  
}