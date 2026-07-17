import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Marriage, MarriageDocument } from "./schema/marriage.schema";
import { CreateMarriageDto } from "./dto/create-marriage.dto";
import { UpdateMarriageDto } from "./dto/update-marriage.dto";
import { toObjectId } from "../../common/utils/objectId.utils";

@Injectable()
export class MarriageRepository {

    constructor(
        @InjectModel(Marriage.name)
        private readonly MarriageModel: Model<MarriageDocument>
    ){}

    async create( createMarriageDto: CreateMarriageDto ) {
      
      const marriageData= { 
       ...createMarriageDto,
       brideAadharId: toObjectId(createMarriageDto.brideAadharId),
       groomAadharId: toObjectId(createMarriageDto.groomAadharId),
       witnessAadharId: toObjectId(createMarriageDto.witnessAadharId),
       brahmanAadharId: toObjectId(createMarriageDto.brahmanAadharId),
       OfficeDepartmentId: toObjectId(createMarriageDto.officeDepartmentId),
      };
      
      return await this.MarriageModel.create( marriageData );
    }

    async findAll(skip: number, limit: number, page: number) {
        const data = await this.MarriageModel.find().skip(skip).limit(limit)
        .populate('brideAadharId')
        .populate('groomAadharId')
        .populate('witnessAadharId')
        .populate('brahmanAadharId')
        .populate({
         path: 'officeDepartmentId',
         populate: [
            {
            path: 'officeId',
            populate: {
                path: 'districtId',
                populate: {
                path: 'stateId',
                },
            },
            },
            {
            path: 'departmentId',
            },
        ],
        });

        const total = await this.MarriageModel.countDocuments();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
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