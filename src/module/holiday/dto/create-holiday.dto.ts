import { IsString, IsNotEmpty, IsMongoId, IsDateString, IsDate, IsNumber, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class CreateHolidayDto {

     // @IsDate()
     // @IsNotEmpty()
     // @Type(() => Date)
     // holidayDate!: Date;

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