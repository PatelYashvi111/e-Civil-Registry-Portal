import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleEnum } from '../../../common/enums/role.enums';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({
    required: true,
    unique: true,
    enum: RoleEnum,
  })
  name!: RoleEnum;
}

export const RoleSchema = SchemaFactory.createForClass(Role);