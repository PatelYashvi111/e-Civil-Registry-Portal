import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DistrictDocument = HydratedDocument<District>;

@Schema({ 
    timestamps: true
 })

export class District {
    @Prop({
        required: true,
        type: String,
        trim: true,
    })
    name!: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'State',
        required: true,
    })
    stateId!: Types.ObjectId;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
