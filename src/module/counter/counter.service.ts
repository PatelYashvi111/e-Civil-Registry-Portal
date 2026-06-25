import { Injectable } from "@nestjs/common";
import { CounterRepository } from "./counter.repository";

@Injectable()
export class CounterService {
  constructor(
    private readonly counterRepo: CounterRepository,
  ) {}

  async getNextSequence(key: string): Promise<number> {
    const counter = await this.counterRepo.increment(key);
    return counter.sequence;
  }
}