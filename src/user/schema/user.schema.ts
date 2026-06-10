import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserStatusEnum } from '../../common/enums/user.status.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ 
    timestamps: true
 })

export class User {

  @Prop({
     type: Types.ObjectId,
      ref: 'Role' 
    })
  roleId!: Types.ObjectId;

  @Prop({
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
    default: null
  })
  employeeId!: string | null;

  @Prop({ 
    required: true, 
    unique: true 
 })
  email!: string;

  @Prop({ 
    required: true
 })
  password!: string;

  @Prop({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.PENDING,
  })
  status!: UserStatusEnum;

  @Prop({
    default: null
  })
  lastLoginAt!: Date | null;

  @Prop({
    default: null
  })
  lastAssignedAt!: Date | null;

  @Prop({
    default: null
  })
  aadharCard!: string | null; 

  @Prop({
    default: null
  })
  signature!: string | null;

  @Prop({
    default: null
  })
  govEmployeIdCard!: string | null;

  @Prop({
    default: null
  })
  refreshToken!: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);