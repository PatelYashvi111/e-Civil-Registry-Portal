import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusEnum } from 'src/common/enums/status.enums';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ 
    timestamps: true 
})

export class Application {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'User',
    required: true,
 })
    userId!: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    unique: true, 
 })
    applicationNumber!: string;

    @Prop({ 
    required: true, 
    type: Types.ObjectId,
    ref: 'User', 
 })
   clerkId!: Types.ObjectId;

  @Prop({
    required: true, 
    type: Types.ObjectId,
    ref: 'OfficeDepartment',
  })
    officeDepartmentId!: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Slot',
  })
   slotId!: Types.ObjectId;

   @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Birth',
    default: null,
   })
   birthId!: Types.ObjectId | null;

   @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Marriage',
    default: null,
   })
   marriageId!: Types.ObjectId | null;

   @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Death',
    default: null,
   })
   deathId!: Types.ObjectId | null;
  
  @Prop({
    type: String,
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
    status!: StatusEnum;

  @Prop({
    type: String,
  })
   remark?: string;

}

export const ApplicationSchema = SchemaFactory.createForClass(Application);