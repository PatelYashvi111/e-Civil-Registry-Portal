import { IsString, IsDateString, IsNotEmpty, IsMongoId, IsNumber, IsEnum, IsOptional, IsBoolean, IsDate } from "class-validator";
import { GenderEnum } from "src/common/enums/gender.enums";
import { Type } from "class-transformer";

export class CreateBirthDto {
    
    @IsString()
    @IsNotEmpty()
    babyName!: string;

    // @IsDate()
    // @Type(() => Date)
    // @IsNotEmpty()
    // birthDateAndTime!: string;

    @IsDateString()
    @IsNotEmpty()
    birthDateAndTime!: string;

    @IsNotEmpty()
    @IsMongoId()
    officeDepartmentId!: string;

    @IsString()
    @IsNotEmpty()
    birthPlace!: string;

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    babyGender!: GenderEnum;
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    babyWeight!: number;

    @IsNotEmpty()
    @IsMongoId()
    fatherAadharId!: string;

    @IsNotEmpty()
    @IsMongoId()
    motherAadharId!: string;

    @IsNotEmpty()
    @IsString()
    slotId!: string;

    // @IsNotEmpty()
    // @IsString()
    // motherVerificationToken!: string;

    // @IsNotEmpty()
    // @IsString()
    // fatherVerificationToken!: string
 
}