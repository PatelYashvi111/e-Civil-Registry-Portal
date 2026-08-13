import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IceCandidateDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  candidate!: RTCIceCandidateInit;
}