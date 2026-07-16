import { IsOptional, IsNumber, Min, Max, IsString} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
@IsOptional()
@Type(() => Number)
@IsNumber()
@Min(1)
@Max(10)
page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 5;

  @IsOptional()
  @Type(() => String)
  search?: string; 
}