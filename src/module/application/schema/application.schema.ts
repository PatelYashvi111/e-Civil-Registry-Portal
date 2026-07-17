import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusEnum } from 'src/common/enums/clerk.status.enums';
import { ServiceEnum } from 'src/common/enums/service.enums';

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
   })
   serviceId!: Types.ObjectId;

   @Prop({
    required: true,
    type: String,
    enum: ServiceEnum,
   })
   serviceType!: ServiceEnum;
  
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