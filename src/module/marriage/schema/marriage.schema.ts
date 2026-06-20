import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MarriageDocument = HydratedDocument<Marriage>

@Schema({
    timestamps: true,
})

export class Marriage {

      @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar',
      })
      brideAadharId!: Types.ObjectId;

      @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar',
      })
      groomAadharId!: Types.ObjectId;

      @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar',
      })
<<<<<<< HEAD
      witnessAadharId!: Types.ObjectId;
=======
      witnessAadharId!: string;
>>>>>>> 04b3cd46bd1414ecebbd9e45b281679b4c32f85b

      @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Aadhar'
      })
<<<<<<< HEAD
      brahmanAadharId!: Types.ObjectId;
=======
      brahmanAadharId!: string;
>>>>>>> 04b3cd46bd1414ecebbd9e45b281679b4c32f85b

      @Prop({
        required: true,
        type: String,
      })
      brideFatherName!: string;

      @Prop({
        required: true,
        type: String,
      })
      brideMotherName!: string;

      @Prop({
        required: true,
        type: String,
      })
      groomFatherName!: string;

      @Prop({
        required:true,
        type: String,
      })
      groomMotherName!: string;

      @Prop({
        required: true,
        type: String,
      })
      witnessRelation!: string;

      @Prop({
        required: true,
        type: Date,
      })
      marriageDate!: Date;

      @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'District',
      })
      marriageDistrict!: Types.ObjectId;

      @Prop({
        required: true,
        type: String,
      })
      marriagePlace!: string;

      @Prop({
        required: true,
        type: String,
      })
      brideAadharCard!: string;

      @Prop({
        required: true,
        type: String,
      })
      groomAadharCard!: string;

       @Prop({
        required: true,
        type: String,
      })
      witnessAadharCard!: string;

       @Prop({
        required: true,
        type: String,
      })
      brahmanAadharCard!: string;

       @Prop({
        required: true,
        type: String,
      })
      brideRationCard!: string;

       @Prop({
        required: true,
        type: String,
      })
      groomRationCard!: string;

       @Prop({
        required: true,
        type: String,
      })
      bridePhoto!: string;

       @Prop({
        required: true,
        type: String,
      })
      groomPhoto!: string;

      @Prop({
        required: true,
        type: String,
      })
      invitationCard!: string;

}

export const MarriageSchema = SchemaFactory.createForClass(Marriage);
