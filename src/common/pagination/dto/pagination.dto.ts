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
<<<<<<< HEAD
  limit?: number = 5;

   @IsOptional()
  @IsString()
  search?: string;

=======
  limit?: number = 10;

  @IsOptional()
  @Type(() => String)
  search?: string; 
>>>>>>> feat/user
}