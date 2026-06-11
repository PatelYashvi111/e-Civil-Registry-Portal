import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument , Types} from 'mongoose';

export type ClerkScheduleDocument = HydratedDocument<ClerkSchedule>;

@Schema({
    timestamps: true,
})

export class ClerkSchedule {

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    clerkId!: Types.ObjectId;
    
    @Prop({
        type: Types.ObjectId,
        ref: 'Slot',
        required: true,
    })
    slotId!: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Application',
        required: true,
    })
    applicationId!: Types.ObjectId;
    
}

export const ClerkScheduleSchema = SchemaFactory.createForClass(ClerkSchedule);