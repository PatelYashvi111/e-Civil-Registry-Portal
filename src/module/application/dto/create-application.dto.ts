import { IsString, IsMongoId, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { StatusEnum } from "src/common/enums/status.enums";

export class CreateApplicationDto {

  @IsNotEmpty()
  @IsMongoId()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  applicationNumber!: string; 

  @IsNotEmpty()
  @IsMongoId()
  ClerkId!: string;

  @IsNotEmpty()
  @IsMongoId()
  OfficeDepartmentId!: string;

  @IsNotEmpty()
  @IsMongoId()
  slotId!: string;

  @IsNotEmpty()
  @IsMongoId()
  birthId!: string;

  @IsNotEmpty()
  @IsMongoId()
  marriageId!: string;

  @IsNotEmpty()
  @IsMongoId()
  deathId!: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @IsOptional()
  @IsString()
  remarks?: string;
}