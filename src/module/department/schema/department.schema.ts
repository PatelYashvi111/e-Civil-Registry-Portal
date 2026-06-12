import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ 
    timestamps: true
 })

export class Department {
    @Prop({
        required: true,
    })
    name!: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
