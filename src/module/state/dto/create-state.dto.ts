 import { IsNotEmpty,  IsString, MaxLength } from 'class-validator';

export class CreateStateDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name!: string;

}