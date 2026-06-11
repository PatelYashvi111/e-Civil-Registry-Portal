import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SlotDocument = HydratedDocument<Slot>;

@Schema({ 
    timestamps: true,
 })

export class Slot {

    @Prop({
        type: Types.ObjectId,
        ref: 'OfficeDepartment', 
        required: true,
    })
    officeDepartmentId!: Types.ObjectId;

    @Prop({
        required: true,
    })
    slotDate!: Date;

    @Prop({
        required: true,
        trim: true,
    })
    startTime!: string;

    @Prop({
        required: true,
        trim: true,
    })
    endTime!: string;
    
    @Prop({
        required: true,
        min: 1,
    })
    maxCapacity!: number;

    @Prop({
        default: 0,
        min: 0,
    })
    bookedCount!: number;

    @Prop({
        default: true,
    })
    isAvailable!: boolean;

}

export const SlotSchema = SchemaFactory.createForClass(Slot);