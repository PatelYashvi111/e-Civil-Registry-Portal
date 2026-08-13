import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OfferDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  offer!: RTCSessionDescriptionInit;
}