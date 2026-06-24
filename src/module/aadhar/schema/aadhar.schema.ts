import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum } from 'src/common/enums/gender.enums';

export type AadharDocument = HydratedDocument<Aadhar>;

@Schema({ 
    timestamps: true
 })

export class Aadhar {
    
   @Prop({
      required: true,
      unique: true,
      trim: true,
      type: String,
    })
    aadharNumber!: string;

    @Prop({
        required: true,
        type: String,
    })
    firstName!: string;

    @Prop({
        required: false,
        type: String,
    })
    middleName?: string;

    @Prop({
        required: true,
        type: String,
    })
    lastName!: string;

    @Prop({
       required: true,
       unique: true,
       lowercase: true,
       trim: true,
       type: String,
   })
   email!: string;

    @Prop({
        required: true,
        type: String,
    })
    contact!: string;

    @Prop({
        required: true,
        type: String,
       
    })
    dob!:Date;

    @Prop({
        required: true,
        enum: GenderEnum,
        type: String,
    })
    gender!: GenderEnum;

    @Prop({
        required: true,
        type: String,
    })
    photo!: string;
    
    @Prop({
        required: true,
        type: String,
    })
    address!: string;

    @Prop({
        required: true,
        type: String,
    })
    street!: string;
    
    @Prop({
        required: true,
        type: String,
    })
    city!: string;

    @Prop({
        required: true,
        type: String,
    })
    taluka!: string;

    @Prop({
        required: true,
        type: String,
    })
    district!: string;

    @Prop({
        required: true,
        type: String,
    })
    state!: string;

   @Prop({
    required: true,
    type: String,
   })
   pinCode!: string;

}

export const AadharSchema = SchemaFactory.createForClass(Aadhar);