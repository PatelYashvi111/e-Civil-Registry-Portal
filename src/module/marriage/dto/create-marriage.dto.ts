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
    marriageDistrict!: string;

    @IsString()
    @IsNotEmpty()
    marriagePlace!: string;

    @IsString()
    @IsNotEmpty()
    brideAadharCard!: string;

    @IsString()
    @IsNotEmpty()
    groomAadharCard!: string;

    @IsString()
    @IsNotEmpty()
    witnessAadharCard!: string;

    @IsString()
    @IsNotEmpty()
    brahmanAadharCard!: string;

    @IsString()
    @IsNotEmpty()
    brideRationCard!: string;

    @IsString()
    @IsNotEmpty()
    groomRationCard!: string;

    @IsString()
    @IsNotEmpty()
    bridePhoto!: string;

    @IsString()
    @IsNotEmpty()
    groomPhoto!: string;

    @IsString()
    @IsNotEmpty()
    invitationCard!: string;
    
}