import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Aadhar, AadharDocument } from "../aadhar/schema/aadhar.schema";

@Injectable()
export class AadharRepository {

        constructor(
            @InjectModel(Aadhar.name)
            private readonly aadharModel: Model<AadharDocument>
        ) {} 

        async createAadhar(data: any) {
            return await this.aadharModel.create(data);
        }

        async findAll() {
            return await this.aadharModel.find();
        }

        async findById(id: string) {
            return await this.aadharModel.findById(id);
        }

        async findByAadharNumber(aadharNumber: string) {
            return await this.aadharModel.findOne({ aadharNumber });
        }

        async updateAadhar(id: string, data: any) {
            return await this.aadharModel.findByIdAndUpdate(id, data, { new: true });
        }

        async deleteAadhar(id: string) {
            return await this.aadharModel.findByIdAndDelete(id);
        }

}