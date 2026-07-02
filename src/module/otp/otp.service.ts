import { Injectable, BadRequestException, NotFoundException} from "@nestjs/common";
import { OtpRepository } from "./otp.repository";
import { Otp, OtpDocument } from "./schema/otp.schema";
import { OtpEnum } from "../../common/enums/otp.enums";

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
}