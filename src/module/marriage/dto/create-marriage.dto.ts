import { IsString, IsNotEmpty, IsDateString, IsMongoId } from "class-validator";

export class CreateMarriageDto {

    @IsNotEmpty()
    @IsMongoId()
    brideAadharId!: string;

    @IsNotEmpty()
    @IsMongoId()
    groomAadharId!: string;

    @IsNotEmpty()
    @IsMongoId()
    witnessAadharId!: string;

    @IsNotEmpty() 
    @IsMongoId()                                                                                      
    brahmanAadharId!: string;

    @IsString()
    @IsNotEmpty()
    brideFatherName!: string;

    @IsString()
    @IsNotEmpty()
    brideMotherName!: string;

    @IsString()
    @IsNotEmpty()
    groomFatherName!: string;

    @IsString()
    @IsNotEmpty()
    groomMotherName!: string;

    @IsString()
    @IsNotEmpty()
    witnessRelation!: string;

    @IsDateString()
    @IsNotEmpty()
    marriageDate!: string;

    @IsNotEmpty()
    @IsMongoId()
    officeDepartmentId!: string;

    @IsString()
    @IsNotEmpty()
    marriagePlace!: string;

    @IsString()
    @IsNotEmpty()
    bridePhoto!: string;

    @IsString()
    @IsNotEmpty()
    groomPhoto!: string;

    @IsString()
    @IsNotEmpty()
    slotId!: string;

    @IsString()
    @IsNotEmpty()
    brideVerificationToken!: string;

    @IsString()
    @IsNotEmpty()
    groomVerificationToken!: string;

    @IsString()
    @IsNotEmpty()
    brahmanVerificationToken!: string;

    @IsString()
    @IsNotEmpty()
    witnessVerificationToken!: string;
    
}