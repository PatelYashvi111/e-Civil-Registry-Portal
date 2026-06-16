import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OtpEnum } from "../../common/enums/otp.enums";

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
    timestamps: true
})

export class Otp {

    @Prop({
        type: Types.ObjectId,
        ref:'User',
    })
    userId!: Types.ObjectId;

    @Prop({
        type: Types.ObjectId
    })
    aadharId!: Types.ObjectId;

    @Prop({
        required: true,
        type: String
    })
    otpNumber!: string;
 
    @Prop({
       required: true,
          type: String,
          enum: OtpEnum,
          trim: true
    })
    serviceType!: OtpEnum;
    
    @Prop({
        required: true,
        type: Date
    })
    expiredAt!: Date;

}