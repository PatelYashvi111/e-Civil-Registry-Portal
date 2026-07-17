import { Prop, Schema ,SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DeathEnum } from 'src/common/enums/death.enums';

export type DeathDocument = HydratedDocument<Death>

@Schema({
    timestamps: true,
})

export class Death {

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar',
    })
    deceasedAadharId!: Types.ObjectId;

    @Prop({
         required: true,
         type: Types.ObjectId,
         ref: 'officeDepartment',
    })
    officeDepartmentId!: Types.ObjectId;
    
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar'
    })
    applicantAadharId!: Types.ObjectId; 
   
    @Prop({
        required: true,
        type: String,
    })
    placeOfDeath!: string;

    @Prop({
        required: true,
        type: Date,
    })
    dateAndTimeOfDeath!: Date;

    @Prop({
        required: true,
        type: String,
    })
    deceasedFatherName!: string;

    @Prop({
        required: true,
        type: String,
    })
    deceasedMotherName!: string;

    @Prop({
        required: true,
        type: String,
        trim: true,
        enum: DeathEnum
    })
    deathType!: DeathEnum;

    @Prop({
        required: true,
        type: String,
    })
    deceasedAadharCard!: string;

    @Prop({
        required: true,
        type: String,
    })
    applicantAadharCard!: string;

    @Prop({
        required: true,
        type: String,
    })
    deceasedRationCard!: string;

    @Prop({
        required: true,
        type: String,
    })
    deceasedPhoto!: string;

    @Prop({
        required: true,
        type: String,
    })
    deceasedMedicalCertificate!: string;

    @Prop({
        required: true,
        type: String,
    })
    pmReport!: string;

    @Prop({
        required: true,
        type: String,
    })
    fir!: string;

    @Prop({
        required: true,
        type: String,
    })
    deceasedVerificationToken!: string;

    @Prop({
    required: true,
    type: String,
    })
    applicantVerificationToken!: string;

}

export const DeathSchema = SchemaFactory.createForClass(Death);