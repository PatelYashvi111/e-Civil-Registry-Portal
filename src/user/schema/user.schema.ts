import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

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
  officeDepartmentId!: Types.ObjectId;

  @Prop()
  employeeId!: string;

  @Prop({ 
    required: true, 
    unique: true 
})
  email!: string;

  @Prop({ 
    required: true
 })
  password!: string;

  @Prop()
  lastLoginAt!: Date;

  @Prop()
  lastAssignedAt!: Date;

  @Prop()
  aadharCard!: string;

  @Prop()
  signature!: string;

  @Prop()
  govEmployeIdCard!: string;

  @Prop()
  refreshToken!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);