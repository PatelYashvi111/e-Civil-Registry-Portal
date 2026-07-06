import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Application, ApplicationDocument } from "./schema/application.schema";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationRepository {

    constructor(
        @InjectModel(Application.name)
        private readonly applicationModel: Model<ApplicationDocument>
    ) {}

    async createApplication( createApplicationDto: CreateApplicationDto ) {
        return await this.applicationModel.create(createApplicationDto);
    }

    async findAll() {
        return await this.applicationModel.find();
    }

    async findById(id: string) {
        return await this.applicationModel.findById(id);
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