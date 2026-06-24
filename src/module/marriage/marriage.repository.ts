import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Marriage, MarriageDocument } from "./schema/marriage.schema";
import { CreateMarriageDto } from "./dto/create-marriage.dto";
import { UpdateMarriageDto } from "./dto/update-marriage.dto";

@Injectable()
export class MarriageRepository {

    constructor(
        @InjectModel(Marriage.name)
        private readonly MarriageModel: Model<MarriageDocument>
    ){}

    async create( createMarriageDto: CreateMarriageDto ) {
        return await this.MarriageModel.create( createMarriageDto );
    }

    async findAll() {
        return await this.MarriageModel.find();
    }

    async findDuplication( 
        brideAadharId: string, 
        groomAadharId: string, 
        marriageDate: Date, 
    ){
        return await this.MarriageModel.findOne({brideAadharId, groomAadharId, marriageDate})
    }

    async findById( id: string ) {
        return await this.MarriageModel.findById( id );
    }

    async update( id: string, updateMarriageDto: UpdateMarriageDto) {
        return await this.MarriageModel.findByIdAndUpdate( id, updateMarriageDto );
    }

    async delete( id: string ) {
        return await this.MarriageModel.findByIdAndDelete( id );
    }
    
}