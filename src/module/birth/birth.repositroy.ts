import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Birth, BirthDocument } from "./schema/birth.schema";
import { CreateBirthDto } from "./dto/create-birth.dto";
import { UpdateBirthDto } from "./dto/update-birth.dto";

@Injectable()
export class BirthRepository {

    constructor(
        @InjectModel(Birth.name)
        private readonly BirthModel: Model<BirthDocument>
    ){}

    async create( createBirthDto: CreateBirthDto) {
        return await this.BirthModel.create(createBirthDto);
    }

    async findAll(skip: number, limit: number, page: number) {
        const data = await this.BirthModel.find().skip(skip).limit(limit)
        .populate('fatherAadharId').populate('motherAadharId').populate({path: 'districtId',populate: {path: 'stateId'}});
        const total = await this.BirthModel.countDocuments();
        return{
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async findDuplication( babyName: string, birthDateAndTime: Date, fatherAadharId: string, motherAadharId: string ) {
        return await this.BirthModel.findOne({ babyName, birthDateAndTime, fatherAadharId, motherAadharId })
    }

    async findById( id: string ) {
        return await this.BirthModel.findById(id);
    }

    async update( id: string, updateBirthDto: UpdateBirthDto) {
        return await this.BirthModel.findByIdAndUpdate( id, updateBirthDto);
    }

    async delete( id: string ) {
        return await this.BirthModel.findByIdAndDelete( id );
    }

}