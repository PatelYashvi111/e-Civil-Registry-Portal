import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Counter, CounterDocument } from "../counter/schema/counter.schema";

@Injectable()
export class CounterRepository {
  constructor(
    @InjectModel(Counter.name)
    private counterModel: Model<CounterDocument>,
  ) {}

  async findByKey(key: string) {
    return this.counterModel.findOne({ key });
  }

  async createKey(key: string) {
    return this.counterModel.create({ key, sequence: 1 });
  }

  async increment(key: string) {
    return this.counterModel.findOneAndUpdate(
      { key },
      { $inc: { sequence: 1 } },
      { returnDocument: 'after', upsert: true},
    );
  }
}