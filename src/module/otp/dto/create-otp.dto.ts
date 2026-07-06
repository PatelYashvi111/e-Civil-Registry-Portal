import { IsNotEmpty, IsString, IsOptional, IsEnum, IsMongoId, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { OtpEnum } from '../../../common/enums/otp.enums';

export class CreateOtpDto {

    @IsOptional()
    @IsMongoId()
    userId?: string;

    @IsOptional()
    @IsMongoId()
    aadharId?: string;

    @IsNotEmpty()
    @IsString()
    otpNumber!: string;

    @IsNotEmpty()
    @IsEnum(OtpEnum)
    serviceType!: OtpEnum;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    expiredAt!: Date;

}
