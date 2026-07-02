import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";
import { Otp, OtpDocument } from "./schema/otp.schema";

@Injectable()
export class OtpRepository {

    constructor(
        @InjectModel(Otp.name)
        private readonly otpModel: Model<OtpDocument>
    ) {}

    async createOtp( otp: Otp ) {
        return await this.otpModel.create(otp);
    }

    async findOne(filter: QueryFilter<OtpDocument>) {
        return await this.otpModel.findOne(filter);
    }

    async findById(id: string) {
        return await this.otpModel.findById(id);
    }

    async updateOtp(id: string, otp: Partial<Otp>) {
        return await this.otpModel.findByIdAndUpdate(id, otp, { new: true});
    }

    async deleteOtp(id: string) {
        return await this.otpModel.findByIdAndDelete(id);
    }

}