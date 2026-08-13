import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Slot, SlotDocument } from "./schema/slot.schema";
import { CreateSlotDto } from "./dto/create-slot.dto";
import { UpdateSlotDto } from "./dto/update-slot.dto";
import { Types } from "mongoose";
import { FilterSlotDto } from "./dto/filter-slot.dto";
import { DateFilterEnum } from "src/common/enums/date.status.enums";
import { PaginationUtil } from "src/common/utils/pagination.utils";

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


async findAll(filterSlotDto: FilterSlotDto) {
  const { page = 1, limit = 8, search, dateFilter } = filterSlotDto;

  const skip = PaginationUtil.getSkip(page, limit);

  const pipeline: any[] = [
    {
      $lookup: {
        from: "officedepartments",
        localField: "officeDepartmentId",
        foreignField: "_id",
        as: "officeDepartment",
      },
    },
    {
      $unwind: {
        path: "$officeDepartment",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "offices",
        localField: "officeDepartment.officeId",
        foreignField: "_id",
        as: "office",
      },
    },
    {
      $unwind: {
        path: "$office",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "districts",
        localField: "office.districtId",
        foreignField: "_id",
        as: "district",
      },
    },
    {
      $unwind: {
        path: "$district",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "officeDepartment.departmentId",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (search) {
    pipeline.push({
      $addFields: {
        slotDateString: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$slotDate",
          },
        },
      },
    });

    pipeline.push({
      $match: {
        $or: [
          {
            slotDateString: {
              $regex: search,
              $options: "i",
            },
          },
          {
            startTime: {
              $regex: search,
              $options: "i",
            },
          },
          {
            endTime: {
              $regex: search,
              $options: "i",
            },
          },
          {
            "office.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "district.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "department.name": {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  let filterSlots = await this.slotModel.aggregate(pipeline);

  if (dateFilter && dateFilter !== DateFilterEnum.ALL) {
    const targetDate = new Date();

    if (dateFilter === DateFilterEnum.TOMORROW) {
      targetDate.setUTCDate(targetDate.getUTCDate() + 1);
    }

    filterSlots = filterSlots.filter((slot: any) => {
      const slotDate = new Date(slot.slotDate);

      return (
        slotDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
        slotDate.getUTCMonth() === targetDate.getUTCMonth() &&
        slotDate.getUTCDate() === targetDate.getUTCDate()
      );
    });

  }

  const countPipeline = [...pipeline];
      countPipeline.push({
        $count: 'total',
      });

      const CountResult = await this.slotModel.aggregate(countPipeline);

      pipeline.push({
        $sort: {
          slotDate: 1,
          startTime: 1,
        },
      });

pipeline.push(
  {
    $skip: skip,
  },
  {
    $limit: Number(limit),
  }
);
      pipeline.push({
        $project: {
          _id: 1,
          name: 1,
          slotDate: 1,
          startTime: 1,
          endTime: 1,
          maxCapacity: 1,
          bookedCount: 1,
          isAvailable: 1,
          officeDepartmentId: {
            _id: '$officeDepartment._id',
          officeId: {
            _id: '$office._id',
            name: '$office.name',
          districtId: {
            _id: '$district._id',
            name: '$district.name',
          },
        },
          departmentId: {
            _id: '$department._id',
            name: '$department.name',
          },
        },
      },
      });
          
 
  const total = filterSlots.length;

const data = await this.slotModel.aggregate(pipeline);

  return {
    ...PaginationUtil.getPaginationResponse(
    data,
    total,
    page,
    limit,
    ),
    search,
  };

}
    async findById(id: string) {
        return await this.slotModel.findById(id);
    }

   async findByTime(officeDepartmentId: string, slotDate: Date, startTime: string, endTime: string) {
       return await this.slotModel.findOne({
        officeDepartmentId,
        slotDate,
        startTime,
        endTime,
       });
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