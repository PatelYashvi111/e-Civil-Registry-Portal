import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from '../department/schema/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentRepository {
  
    constructor(
        @InjectModel(Department.name)
        private readonly model: Model<Department>
    ) {}

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    return await this.model.create( createDepartmentDto );
  }

  async findAll() {
    return await this.model.find();
  }

  async findByName(name: string) {
    return await this.model.findOne({ name });
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return await this.model.findByIdAndUpdate(id, updateDepartmentDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}