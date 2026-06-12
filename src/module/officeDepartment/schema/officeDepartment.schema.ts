import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OfficeDepartmentDocument = HydratedDocument<OfficeDepartment>;

@Schema({ 
    timestamps: true
 })

export class OfficeDepartment {

    @Prop({
        type: Types.ObjectId,
        ref: 'Office',
        required: true,
    })
    officeId!: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Department',
        required: true,

    })
    departmentId!: Types.ObjectId;
}

export const OfficeDepartmentSchema = SchemaFactory.createForClass(OfficeDepartment);
