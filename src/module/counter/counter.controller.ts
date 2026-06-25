import { Controller, Get, Param } from "@nestjs/common";
import { CounterService } from "./counter.service";

@Controller("counter")
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get(":key")
  async getNext(@Param("key") key: string) {
    return this.counterService.getNextSequence(key);
  }
}