import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { ApplicationStatusEnum } from "src/common/enums/application.status.enums";

export class FilterDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ApplicationStatusEnum)
  status?: ApplicationStatusEnum;
}