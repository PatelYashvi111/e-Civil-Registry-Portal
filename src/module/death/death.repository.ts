import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Death, DeathDocument } from "./schema/death.schema";
import { CreateDeathDto } from "./dto/create-death.dto";
import { UpdateDeathDto } from "./dto/update-death.dto";

@Injectable()
export class DeathRepository {

    constructor(
        @InjectModel(Death.name)
        private readonly DeathModel: Model<DeathDocument>
    ){}

    async create( createDeathDto: CreateDeathDto ) {
        return await this.DeathModel.create( createDeathDto );
    }

    async findAll() {
        return await this.DeathModel.find();
    }

    async findDuplication(deacasedAadharId: string, dateAndTimeOfDeath: Date ) {
        return await this.DeathModel.findOne({deacasedAadharId, dateAndTimeOfDeath })
    }
        
    async findById( id: string ) {
        return await this.DeathModel.findById( id );
    }

    async update( id: string, updateDeathDto: UpdateDeathDto) {
        return await this.DeathModel.findByIdAndUpdate( id, updateDeathDto );
    }

    async delete( id: string ) {
        return await this.DeathModel.findByIdAndDelete( id );
    }
    
}