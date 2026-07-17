import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusEnum } from '../../../common/enums/clerk.status.enums';


export type ClerkDocument = HydratedDocument<Clerk>;

@Schema({
    timestamps: true,
})

export class Clerk {
     @Prop({
        required: true,
        type: String,
     })
    aadharNumber!: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'OfficeDepartment',
    })
    officeDepartmentId!: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'District',
    })
    districtId!: Types.ObjectId;

    @Prop({
        required: true,
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    })
    email!: string;

    @Prop({
        required: true,
        type: String,
    })
    password!: string;

    @Prop({
        required: true,
        type: String,
        unique: true,
    })
    employeeId!: string;

     @Prop({
    type: String,
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status!: StatusEnum;

  @Prop({
    required: true,
    type: String,
  })
  aadharCard!: string;

  @Prop({
    required: true,
    type: String,
  })
  signature!: string;

  @Prop({
    required: true,
    type: String,
  })
  govEmployeeIdCard!: string;

  // @Prop({
  //   required: true,
  //   type: String,
  // })
  // verificationToken!: string;
}

export const ClerkSchema = SchemaFactory.createForClass(Clerk);

