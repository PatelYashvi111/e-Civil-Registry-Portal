import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOfficeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    name!: string;
    
    @IsNotEmpty()
    @IsMongoId()
    districtId!: string;
  }
