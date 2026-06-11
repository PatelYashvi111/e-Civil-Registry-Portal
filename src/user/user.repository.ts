import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel( User.name ) private userModel: Model<UserDocument>
    ){}

    async createUser( createUserDto: CreateUserDto ){
        const createdUser = new this.userModel( createUserDto );
        return createdUser.save();
    }

    async findByEmail( email: string ){
        return this.userModel.findOne({ email });
    }

    async findById( id: string ){
        return this.userModel.findById( id );
    }

    async findAll(){
        return this.userModel.find();
    }

    async updateUser( id: string, updateUserDto: UpdateUserDto ){
        return this.userModel.findByIdAndUpdate( id, updateUserDto, { new: true } );
    }

    async deleteUser( id: string ){
        return this.userModel.findByIdAndDelete( id );
    }
}
