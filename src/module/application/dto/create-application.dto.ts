import { IsString, IsMongoId, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { StatusEnum } from "src/common/enums/clerk.status.enums";
import { ServiceEnum } from "src/common/enums/service.enums";

export class CreateApplicationDto {

  @IsNotEmpty()
  @IsMongoId()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  applicationNumber!: string; 

  @IsNotEmpty()
  @IsMongoId()
  clerkId!: string;

  @IsNotEmpty()
  @IsMongoId()
  officeDepartmentId!: string;

  @IsNotEmpty()
  @IsMongoId()
  slotId!: string;

  @IsNotEmpty()
  @IsMongoId()
  serviceId!: string;

  @IsNotEmpty()
  @IsEnum(ServiceEnum)
  serviceType!: ServiceEnum;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @IsOptional()
  @IsString()
  remarks?: string;
}