import { IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
@IsOptional()
@Type(() => Number)
@IsNumber()
@Min(1)
@Max(10)
page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => String)
  search?: string;
  
}