import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Role',
  })
  roleId!: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Aadhar',
  })
  aadharId!: Types.ObjectId;

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
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    required: true,
    unique: true,
  })
  employeeId!: string;

  @Prop()
  aadharCard!: string;

  @Prop()
  signature!: string;

  @Prop()
  govEmployeeIdCard!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);