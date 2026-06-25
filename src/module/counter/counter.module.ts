import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Counter, CounterSchema } from "../counter/schema/counter.schema";
import { CounterService } from "./counter.service";
import { CounterRepository } from "./counter.repository";
import { CounterController } from "./counter.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Counter.name, schema: CounterSchema }
    ])
  ],
  controllers: [CounterController],
  providers: [CounterService, CounterRepository],
  exports: [CounterService],
})
export class CounterModule {}