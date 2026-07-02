import { Injectable, BadRequestException, NotFoundException} from "@nestjs/common";
import { OtpRepository } from "./otp.repository";
import { Otp, OtpDocument } from "./schema/otp.schema";
import { OtpEnum } from "../../common/enums/otp.enums";
import { QueryFilter } from "mongoose";

@Injectable()
export class OtpService {

    constructor(
        private readonly otpRepository: OtpRepository,
    ) {}

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async createOtp(
        feild: 'userId' | 'aadharId',
        id: string,
        serviceType: OtpEnum,
    ) {
        const otpNumber = this.generateOtp();

        const otpRecord  = await this.otpRepository.createOtp({
            [feild]: id,
            otpNumber,
            serviceType,
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
        } as Otp);

        return{ otpNumber, otpRecord };

    }

        async verifyOtp(
            feild: 'userId' | 'aadharId',
            id: string,
            serviceType: OtpEnum
        ) {
            const otpRecord = await this.otpRepository.findOne({
                [feild]: id,
                serviceType,
            });

            if(!otpRecord) {
                throw new NotFoundException('OTP not found');
            }

            if(new Date() > otpRecord.expiredAt) {
                throw new BadRequestException('OTP has expired');
            }

            if(otpRecord.otpNumber !== otpRecord.otpNumber) {
                throw new BadRequestException('Invalid OTP');
            }

            await this.otpRepository.deleteOtp(otpRecord._id.toString());

            return otpRecord;

     }

     async refreshOtp(
        feild: 'userId' | 'aadharId',
        id: string,
        serviceType: OtpEnum
     ) {
        const oldOtpRecord = await this.otpRepository.findOne({
            [feild]: id,
            serviceType,
        }); 
        
        if(oldOtpRecord) {
            await this.otpRepository.deleteOtp(oldOtpRecord._id.toString());
        }

        return await this.createOtp(feild, id, serviceType);
     }

}
