import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApplicationStatusEnum } from '../../../common/enums/application.status.enums';
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
    enum: ApplicationStatusEnum,
    default: ApplicationStatusEnum.PENDING,
  })
    status!: ApplicationStatusEnum;

  @Prop({
    type: String,
  })
   remark?: string;

}

export const ApplicationSchema = SchemaFactory.createForClass(Application);