import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HolidayDocument = HydratedDocument<Holiday>;

@Schema({
    timestamps: true,
})

export class Holiday {

    @Prop({
        required: true,
        type: Date,
    })
    holidayDate!: Date;

    @Prop({
        required: true,
        type: Number,
    })
    year!: number;

    @Prop({
        required: true,
        type: String,
    })
    title!: string;

    @Prop({
        required: true,
        type: String,
    })
    description!: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Office',
    })
    officeId!: Types.ObjectId;

    @Prop({
        required: true,
        type: Boolean,
    })
    isNationalHoliday!: boolean;

}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);