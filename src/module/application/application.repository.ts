import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Application, ApplicationDocument } from "./schema/application.schema";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { StatusEnum } from "src/common/enums/clerk.status.enums";

@Injectable()
export class ApplicationRepository {

    constructor(
        @InjectModel(Application.name)
        private readonly applicationModel: Model<ApplicationDocument>
    ) {}

    async createApplication( createApplicationDto: CreateApplicationDto ) {
        return await this.applicationModel.create(createApplicationDto);
    }

    async findAll(skip: number, limit: number)
     {
        return await this.applicationModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return await this.applicationModel.findById(id);
    }

    async findByUserId(userId: string, skip: number, limit: number) {
        return await this.applicationModel.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async findByApplicationNumber( applicationNumber: string ) {
        return await this.applicationModel.findOne({ applicationNumber });
    }

    async updateApplication( id: string, updateApplicationDto: UpdateApplicationDto ) {
        return await this.applicationModel.findByIdAndUpdate( id, updateApplicationDto, { new: true } );
    }

    async deleteApplication( id: string ) {
        return await this.applicationModel.findByIdAndDelete( id );
    }

}