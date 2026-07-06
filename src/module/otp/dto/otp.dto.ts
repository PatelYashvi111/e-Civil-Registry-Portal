import { IsNotEmpty, IsString, IsOptional, IsEnum, IsMongoId, IsDateString } from 'class-validator';
import { OtpEnum } from '../../../common/enums/otp.enums';

export class OtpDto {

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
    @IsDateString()
    expiredAt!: string;

}
