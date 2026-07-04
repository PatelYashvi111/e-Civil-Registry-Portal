import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CounterDocument = HydratedDocument<Counter>;

@Schema({
    timestamps: true,
})

export class Counter {
     @Prop({
        required: true,
        type: String,
        unique: true,
     })
     key!: string;

     @Prop({
        required: true,
        type: Number,
     })
     sequence!: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
