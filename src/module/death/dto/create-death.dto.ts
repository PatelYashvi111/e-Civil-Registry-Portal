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

    @IsDateString()
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
    @IsMongoId()
    slotId!: string;

    @IsNotEmpty()
    @IsString()
    deceasedVerificationToken!: string;

    @IsNotEmpty()
    @IsString()
    applicantVerificationToken!: string;

}