import { IsEmail, IsNotEmpty, IsOptional, IsString ,IsEnum, IsDateString, IsMongoId, Length } from 'class-validator';
import { GenderEnum } from 'src/common/enums/gender.enums';


export class CreateAadharDto {

    @IsNotEmpty()
    @IsString()
    aadharNumber!: string;

    @IsNotEmpty()
    @IsString()
    firstName!: string;
    
    @IsOptional()
    @IsString()
    middleName?: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    contact!: string;

    @IsNotEmpty()
    @IsDateString()
    dob!: Date;

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender!: GenderEnum;

    @IsNotEmpty()
    @IsString()
    photo!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    street!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsNotEmpty()
    @IsString()
    taluka!: string;

    @IsNotEmpty()
    @IsString()
    district!: string;
    
    @IsNotEmpty()
    @IsString()
    state!: string;

    @IsNotEmpty()
    @IsString()
    pinCode!: string;
    
}