import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Types } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { toObjectId } from "src/common/utils/objectId.utils";

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel( User.name ) private userModel: Model<UserDocument>
    ){}

    async createUser( createUserDto: CreateUserDto ){

        const createdUser = new this.userModel({
            ...createUserDto,
            roleId: toObjectId(createUserDto.roleId),
            aadharId: toObjectId(createUserDto.aadharId),
            officeDepartmentId: createUserDto.officeDepartmentId
            ? toObjectId(createUserDto.officeDepartmentId)
            : undefined,
    });
        
        return createdUser.save();
    }

    async findByEmail( email: string ){
        return this.userModel.findOne({ email });
    }

    async findById( id: string ){
        return this.userModel.findById( id );
    }

    async findAll(skip: number, limit: number, page: number) {
        const data = await this.userModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await this.userModel.countDocuments();
        return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
       };
    }

    async updateUser( id: string, updateUserDto: UpdateUserDto ){
        return this.userModel.findByIdAndUpdate( id, updateUserDto, { new: true } );
    }

    async deleteUser( id: string ){
        return this.userModel.findByIdAndDelete( id );
    }
}
