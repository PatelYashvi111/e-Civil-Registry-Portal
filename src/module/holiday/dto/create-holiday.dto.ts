import { IsString, IsNotEmpty, IsMongoId, IsDateString, IsNumber, IsBoolean } from "class-validator";

export class CreateHolidayDto {

     @IsDateString()
     @IsNotEmpty()
     holidayDate!: Date;
     
     @IsNumber()
     @IsNotEmpty()
     year!: number;
     
     @IsString()
     @IsNotEmpty()
     title!: string;

     @IsString()
     @IsNotEmpty()
     description!: string;
     
     @IsNotEmpty()
     @IsMongoId()
     officeId!: string;

     @IsNotEmpty()
     @IsBoolean()
     isNationalHoliday!: boolean;
     
}