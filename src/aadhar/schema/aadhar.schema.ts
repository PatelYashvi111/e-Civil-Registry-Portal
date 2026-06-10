import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum } from '../../common/enums/gender.enums';

export type AadharDocument = HydratedDocument<Aadhar>;

@Schema({ 
    timestamps: true
 })

export class Aadhar {
    
   @Prop({
      required: true,
      unique: true,
      trim: true,
    })
    aadharNumber!: string;

    @Prop({
        required: true,
    })
    firstName!: string;

    @Prop({
        required: false,
    })
    middleName?: string;

    @Prop({
        required: true,
    })
    lastName!: string;

    @Prop({
       required: true,
       unique: true,
       lowercase: true,
       trim: true,
   })
   email!: string;

    @Prop({
        required: true,
    })
    contact!: string;

    @Prop({
        required: true,
    })
    dob!:Date;

    @Prop({
        required: true,
        enum: GenderEnum
    })
    gender!: GenderEnum;

    @Prop({
        required: true,
    })
    photo!: string;
    
    @Prop({
        required: true,
    })
    address!: string;

    @Prop({
        required: true,
    })
    street!: string;
    
    @Prop({
        required: true,
    })
    city!: string;

    @Prop({
        required: true,
    })
    taluka!: string;

    @Prop({
        required: true,
    })
    district!: string;

    @Prop({
        required: true,
    })
    state!: string;

   @Prop({
    required: true,
   })
   pinCode!: string;

}

export const AadharSchema = SchemaFactory.createForClass(Aadhar);