import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Birth, BirthDocument } from "./schema/birth.schema";
import { CreateBirthDto } from "./dto/create-birth.dto";
import { UpdateBirthDto } from "./dto/update-birth.dto";
import { toObjectId } from "../../common/utils/objectId.utils";
import { PaginationDto } from "../../common/pagination/dto/pagination.dto";
import { PaginationUtil } from "src/common/utils/pagination.utils";

@Injectable()
export class BirthRepository {
    constructor(
        @InjectModel("birth")
        private readonly BirthModel: Model<BirthDocument>
    ){}

    async create(createBirthDto: CreateBirthDto) {
   const birthData = {
    ...createBirthDto,
    fatherAadharId: toObjectId(createBirthDto.fatherAadharId),
    motherAadharId: toObjectId(createBirthDto.motherAadharId),
    officeDepartmentId: toObjectId(createBirthDto.officeDepartmentId),
    slotId: toObjectId(createBirthDto.slotId),
  };

  return await this.BirthModel.create(birthData);
}

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 5 } = paginationDto;

          const skip = PaginationUtil.getSkip(page, limit);
        
        const data = await this.BirthModel.find().skip(skip).limit(limit)
        .populate('fatherAadharId')
        .populate('motherAadharId')
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
                
        const total = await this.BirthModel.countDocuments();
        return PaginationUtil.getPaginationResponse(
            data,
            total,
            page,
            limit,
        );
    }

    async findDuplication( babyName: string, birthDateAndTime: Date, fatherAadharId: string, motherAadharId: string ) {
        return await this.BirthModel.findOne({ 
            babyName, 
            birthDateAndTime, 
            fatherAadharId: toObjectId(fatherAadharId), 
            motherAadharId: toObjectId(motherAadharId) })
    }

    async findById( id: string ) {
        return await this.BirthModel.findById(id)
        .populate("fatherAadharId")
        .populate("motherAadharId")
        .populate({
        path: "officeDepartmentId",
        populate: {
            path: "officeId",
            populate: {
            path: "districtId",
            populate: {
                path: "stateId",
            },
            },
        },
        })
        .populate("slotId");
    }

    async update( id: string, updateBirthDto: UpdateBirthDto) {
        return await this.BirthModel.findByIdAndUpdate( id, updateBirthDto);
    }

    async delete( id: string ) {
        return await this.BirthModel.findByIdAndDelete( id );
    }

}