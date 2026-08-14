import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { DateFilterEnum } from '../../../common/enums/date.status.enums';

export class FilterSlotDto extends PaginationDto {

  @IsOptional()
  @IsEnum(DateFilterEnum)
  dateFilter?: DateFilterEnum;
}