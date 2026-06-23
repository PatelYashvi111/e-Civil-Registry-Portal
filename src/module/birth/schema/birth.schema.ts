import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument, Types } from 'mongoose';
import { GenderEnum } from 'src/common/enums/gender.enums';

export type BirthDocument = HydratedDocument<Birth>

@Schema({
    timestamps: true,
})

export class Birth {
    @Prop({
        required: true,
        type: String,
    })
    babyName!: string;

    @Prop({
        required: true,
        type: Date
    })
    birthDate!:Date;

    @Prop({
        required: true,
        type: String,
    })
    birthTime!: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'District',
    })
    birthDistrictId!: Types.ObjectId;

    @Prop({
        required: true,
        type: String,
    })
    birthPlace!: string;

    @Prop({
        required: true,
        enum: GenderEnum,
        type: String,
    })
    babyGender!: GenderEnum;

    @Prop({
        required: true,
        type: Number,
    })
    babyWeight!: number;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar',
    })
    fatherAadharId!: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar',
    })
    motherAadharId!: Types.ObjectId;

    @Prop({
        required: true,
        type: String,
    })
    fatherAadharCard!: string;

    @Prop({
        required: true,
        type: String,
    })
    motherAadharCard!: string;

    @Prop({
        required: true,
        type: String,
    })
    marriageCertificate!: string;
    
    @Prop({
        required: true,
        type: String,
    })
    birthHospitalReport!: string;

    @Prop({
        required: true,
        type: String,
    })
    rationCard!: string;

}

export const BirthSchema = SchemaFactory.createForClass(Birth); 