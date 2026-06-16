import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { OtpEnum } from '../../../common/enums/otp.enums';

export class OtpDto {

    @IsOptional()
    @IsString()
    userId!: string;

    @IsOptional()
    @IsString()
    aadharId!: string;

    @IsNotEmpty()
    @IsString()
    otpNumber!: string;

    @IsEnum(OtpEnum)
    serviceType!: OtpEnum;

    @IsString()
    expiredAt!: string;

}
