import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { MeetingStatusEnum } from '../../../common/enums/meeting.status.enums';
import { DateFilterEnum } from '../../../common/enums/date.status.enums';

export class FilterMeetingDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsEnum(MeetingStatusEnum)
  status?: MeetingStatusEnum;

  @IsOptional()
  @IsEnum(DateFilterEnum)
  @Transform(({ value }) => value === '' ? undefined : value)
  dateFilter?: DateFilterEnum;
}