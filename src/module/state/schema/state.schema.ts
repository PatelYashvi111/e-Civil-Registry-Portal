import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StateDocument = HydratedDocument<State>;

@Schema({ 
    timestamps: true
 })

export class State {
    @Prop({
        required: true,
        type: String,
    })
    name!: string;
}

export const StateSchema = SchemaFactory.createForClass(State);