import { IsString, IsNotEmpty, IsDateString, IsEnum, IsMongoId } from "class-validator";
import { DeathEnum } from "src/common/enums/death.enums";

export class CreateDeathDto {

    @IsNotEmpty()
    @IsMongoId()
    deceasedAadharId!: string;

    @IsNotEmpty()
    @IsMongoId()
    officeDepartmentId!: string;

    @IsString()
    @IsNotEmpty()
    placeOfDeath!: string;

    @IsString()
    @IsNotEmpty()
    dateAndTimeOfDeath!: string;

    @IsString()
    @IsNotEmpty()
    deceasedFatherName!: string;

    @IsString()
    @IsNotEmpty()
    deceasedMotherName!: string;

    @IsNotEmpty()
    @IsEnum(DeathEnum)
    deathType!: DeathEnum;

    @IsNotEmpty()
    @IsMongoId()
    applicantAadharId!: string;

    @IsNotEmpty()
    @IsString()
    deceasedVerificationToken!: string;

    @IsNotEmpty()
    @IsString()
    applicantVerificationToken!: string;


    // @IsString()
    // @IsNotEmpty()
    // deceasedAadharCard!: string;

    // @IsString()
    // @IsNotEmpty()
    // spouseAadharCard!: string;

    // @IsString()
    // @IsNotEmpty()
    // deceasedRationCard!: string;

    // @IsString()
    // @IsNotEmpty()
    // deceasedPhoto!: string;

    // @IsString()
    // @IsNotEmpty()
    // deceasedMedicalCertificate!: string;

    // @IsString()
    // @IsNotEmpty()
    // pmReport!: string;

    // @IsString()
    // @IsNotEmpty()
    // fir!: string;

}