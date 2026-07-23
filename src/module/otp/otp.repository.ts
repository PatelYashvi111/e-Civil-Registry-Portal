import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";
import { Otp, OtpDocument } from "./schema/otp.schema";
import { CreateOtpDto } from "./dto/create-otp.dto";
import { UpdateOtpDto } from "./dto/update-otp.dto";


@Injectable()
export class OtpRepository {

    constructor(
        @InjectModel(Otp.name)
        private readonly otpModel: Model<OtpDocument>
    ) {}

    async createOtp( createOtpDto: CreateOtpDto ) {
        return await this.otpModel.create(createOtpDto);
    }

    async findOne(filter: QueryFilter<OtpDocument>) {
        return await this.otpModel.findOne(filter).sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return await this.otpModel.findById(id);
    }

    async markOtpVerified(id: string) {
  return this.otpModel.findByIdAndUpdate(
    id,
    {
      isVerified: true,
    },
    {
      new: true,
    },
  );
}

    async updateOtp(id: string, updateOtpDto: UpdateOtpDto) {
        return await this.otpModel.findByIdAndUpdate(id, updateOtpDto, { new: true });
    }

    async deleteOtp(id: string) {
        return await this.otpModel.findByIdAndDelete(id);
    }

    async deleteMany(filter: QueryFilter<OtpDocument>) {
        return await this.otpModel.deleteMany(filter);
    }


}