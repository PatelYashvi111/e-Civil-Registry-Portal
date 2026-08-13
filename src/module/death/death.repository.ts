import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Death, DeathDocument } from "./schema/death.schema";
import { CreateDeathDto } from "./dto/create-death.dto";
import { UpdateDeathDto } from "./dto/update-death.dto";
import { toObjectId } from "../../common/utils/objectId.utils";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { PaginationUtil } from "src/common/utils/pagination.utils";

@Injectable()
export class DeathRepository {

    constructor(
        @InjectModel("death")
        private readonly DeathModel: Model<DeathDocument>
    ){}

    async create( createDeathDto: CreateDeathDto ) {
         const deathData = {
            ...createDeathDto,
            deceasedAadharId: toObjectId(createDeathDto.deceasedAadharId),
            applicantAadharId: toObjectId(createDeathDto.applicantAadharId),
            officeDepartmentId: toObjectId(createDeathDto.officeDepartmentId),
            slotId: toObjectId(createDeathDto.slotId),
          };
        
          return await this.DeathModel.create(deathData);
        }
        

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 5 } = paginationDto;

        const skip = PaginationUtil.getSkip(page, limit);

        const data = await this.DeathModel.find().skip(skip).limit(limit)
        .populate('deceasedAadharId')
        .populate('applicantAadharId')
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

        const total = await this.DeathModel.countDocuments()
    
            return PaginationUtil.getPaginationResponse(
            data,
            total,
            page,
            limit,
            );
        
    }

    async findDuplication(deceasedAadharId: string, dateAndTimeOfDeath: Date ) {
        return await this.DeathModel.findOne({deceasedAadharId, dateAndTimeOfDeath })
    }
        
    async findById( id: string ) {
        return await this.DeathModel.findById( id )
        .populate('deceasedAadharId')
        .populate('applicantAadharId')
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

    async update( id: string, updateDeathDto: UpdateDeathDto) {
        return await this.DeathModel.findByIdAndUpdate( id, updateDeathDto );
    }

    async delete( id: string ) {
        return await this.DeathModel.findByIdAndDelete( id );
    }
    
}