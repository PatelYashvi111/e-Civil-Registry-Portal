import { IsString, IsDateString, IsNotEmpty, IsMongoId, IsNumber, IsEnum} from "class-validator";
import { GenderEnum } from "src/common/enums/gender.enums";

export class CreateBirthDto {
    
    @IsString()
    @IsNotEmpty()
    babyName!: string;

    @IsDateString()
    @IsNotEmpty()
    birthDate!: string;

    @IsString()
    @IsNotEmpty()
    birthTime!: string;

    @IsNotEmpty()
    @IsMongoId()
    birthDistrict!: string;

    @IsString()
    @IsNotEmpty()
    birthPlace!: string;

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    babyGender!: GenderEnum;
    
    @IsNumber()
    @IsNotEmpty()
    babyWeight!: number;

    @IsNotEmpty()
    @IsMongoId()
    fatherAadharId!: string;

    @IsNotEmpty()
    @IsMongoId()
    motherAadharId!: string;
    
    @IsString()
    @IsNotEmpty()
    fatherAadharCard!: string;

    @IsString()
    @IsNotEmpty()
    motherAadharCard!: string;

    @IsString()
    @IsNotEmpty()
    marriageCertificate!: string;
    
    @IsString()
    @IsNotEmpty()
    birthHospitalReport!: string;

    @IsString()
    @IsNotEmpty()
    rationCard!: string;
    
}