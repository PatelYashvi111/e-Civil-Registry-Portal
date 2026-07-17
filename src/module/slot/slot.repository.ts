import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Slot, SlotDocument } from "./schema/slot.schema";
import { CreateSlotDto } from "./dto/create-slot.dto";
import { UpdateSlotDto } from "./dto/update-slot.dto";
import { Types } from "mongoose";

@Injectable()
export class SlotRepository {

    constructor(
        @InjectModel( Slot.name ) 
        private slotModel: Model<SlotDocument>
    ) {}

    async create(createSlotDto: CreateSlotDto) {
        return await this.slotModel.create( createSlotDto );
    }

    async createMany(data: Partial<Slot>[]) {
        return await this.slotModel.insertMany(data);
    }

    async findAll() {
        return await this.slotModel
        .find()
        .populate({
            path: 'officeDepartmentId',
            populate: ['officeId', 'departmentId'],
        });

    }

    async findById(id: string) {
        return await this.slotModel.findById(id);
    }

    async findByOfficeDepartment(officeDepartmentId: string) {
        return await this.slotModel.find({officeDepartmentId})
    }

    async findByOfficeDepartmentAndDate(officeDepartmentId: string, slotDate: Date) {
        return await this.slotModel.findOne({ officeDepartmentId, slotDate });
    }

    async findAvailableDates(officeDepartmentId: string) {
  return this.slotModel.distinct("slotDate", {
    officeDepartmentId: new Types.ObjectId(officeDepartmentId),
    isAvailable: true,
  });
}

async findAvailableSlots(
  officeDepartmentId: string,
  slotDate: Date,
) {
  return this.slotModel.find({
    officeDepartmentId: new Types.ObjectId(officeDepartmentId),
    slotDate,
    isAvailable: true,
  });
}    

    async update(id: string, updateSlotDto: UpdateSlotDto) {
        return await this.slotModel.findByIdAndUpdate(id, updateSlotDto, { returnDocument: 'after' });
    }

    async delete(id: string) {
        return await this.slotModel.findByIdAndDelete(id);
    }

}