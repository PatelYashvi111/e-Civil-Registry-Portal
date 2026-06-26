import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OfficeDocument = HydratedDocument<Office>;

@Schema({ 
    timestamps: true
 })

export class Office { 
    @Prop({
        required: true,
    })
    name!: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'District',
        required: true,
    })
    districtId!: Types.ObjectId;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
