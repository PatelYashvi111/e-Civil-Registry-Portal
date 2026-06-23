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
        type: Date,
    })
    slotDate!: Date;

    @Prop({
        required: true,
        trim: true,
        type: String,
    })
    startTime!: string;

    @Prop({
        required: true,
        trim: true,
        type: String,
    })
    endTime!: string;
    
    @Prop({
        required: true,
        min: 1,
        type: Number,
    })
    maxCapacity!: number;

    @Prop({
        default: 0,
        min: 0,
        type: Number,
    })
    bookedCount!: number;

    @Prop({
        default: true,
        type: Boolean,
    })
    isAvailable!: boolean;

}

export const SlotSchema = SchemaFactory.createForClass(Slot);