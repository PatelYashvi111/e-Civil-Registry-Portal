import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Otp } from "./schema/otp.schema";

@Injectable()
export class OtpRepository {

     contructor(
        @InjectModel(Otp.name)
        private readonly otpModel: Model<Otp>
     ){}

     async createOtp(data: any) {
        return await this.otpModel.create(data);
     }


}