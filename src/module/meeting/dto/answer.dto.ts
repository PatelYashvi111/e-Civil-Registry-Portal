import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  answer!: RTCSessionDescriptionInit;
}