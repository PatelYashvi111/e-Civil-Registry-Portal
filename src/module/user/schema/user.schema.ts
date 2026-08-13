import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ClerkStatusEnum } from '../../../common/enums/clerk.status.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ 
    timestamps: true
 })

export class User {

  @Prop({
     required: true,
     type: Types.ObjectId,
      ref: 'Role' 
    })
  roleId!: Types.ObjectId;

  @Prop({
     required: true,
     unique: true,
     type: Types.ObjectId, 
     ref: 'Aadhar' 
    })
  aadharId!: Types.ObjectId;

  
  @Prop({
      type: Types.ObjectId,
      ref: 'OfficeDepartment', 
      default: null 
    })
  officeDepartmentId!: Types.ObjectId | null;

  @Prop({
    type: String,
    unique: true,
    sparse: true,
  })
  employeeId?: string;

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
    trim: true,
 })
  password!: string;

  @Prop({
    required: true,
    type: String,
    enum: ClerkStatusEnum,
    default: ClerkStatusEnum.PENDING,
    trim: true
  })
  status!: ClerkStatusEnum;

  @Prop({
    type: Date,
    default: null
  })
  lastLoginAt!: Date | null;

  @Prop({
    type: Date,
    default: null
  })
  lastAssignedAt!: Date | null;

  @Prop({
    type: String,
    default: null
  })
  aadharCard!: string | null; 

  @Prop({
    type: String,                 
    default: null
  })
  signature!: string | null;

  @Prop({
    type: String,
    default: null
  })
  govEmployeeIdCard!: string | null;

  @Prop({
    type: String,
    default: null
  })
  refreshToken!: string | null;

  @Prop({
  type: Boolean,
  default: true,
})
isAvailable!: boolean;

@Prop({
  type: Number,
  default: 0,
})
assignedApplicationCount!: number;

  // @Prop({
  //   default: null,
  //   type: String,
  // })
  // verificationToken!: string;

}

export const UserSchema = SchemaFactory.createForClass(User);