import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Aadhar, AadharDocument } from "../aadhar/schema/aadhar.schema";
import { CreateAadharDto } from "./dto/create-aadhar.dto";
import { UpdateAadharDto } from "./dto/update-aadhar.dto";
import { PaginationDto } from "../../common/pagination/dto/pagination.dto";
import { PaginationUtil } from "src/common/utils/pagination.utils";

@Injectable()
export class AadharRepository {

        constructor(
            @InjectModel(Aadhar.name)
            private readonly aadharModel: Model<AadharDocument>
        ) {} 

        async createAadhar(data: CreateAadharDto) {
          return await this.aadharModel.create(data);
        }

        async findAll(paginationDto: PaginationDto) {
          const { page=1, limit=5 } = paginationDto;

          const skip = PaginationUtil.getSkip(page, limit);
                
          const data = await this.aadharModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
            
          const total = await this.aadharModel.countDocuments();
            
          return PaginationUtil.getPaginationResponse(
          data,
          total,
          page,
          limit,
        );  
    }

        async findById(id: string) {
            return await this.aadharModel.findById(id);
        }

        async findByAadharNumber(aadharNumber: string) {
            return await this.aadharModel.findOne({ aadharNumber });
        }

        async updateAadhar(id: string, data: UpdateAadharDto) {
            return await this.aadharModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });
        }

        async deleteAadhar(id: string) {
            return await this.aadharModel.findByIdAndDelete(id);
        }

}