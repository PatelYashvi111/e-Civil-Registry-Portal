import { Injectable } from "@nestjs/common";
import { CounterRepository } from "./counter.repository";

@Injectable()
export class CounterService {
  constructor(
    private readonly counterRepo: CounterRepository,
  ) {}

  private getDateString(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}${month}${day}`;
  }

  private formatSequence(seq: number): string {
    return String(seq).padStart(6, "0");
  }

  async generateBirthApplication(): Promise<string> {
    const prefix = "B";
    const dateStr = this.getDateString();
    const key = `${prefix}${dateStr}`;
    const counter = await this.counterRepo.increment(key);
    const sequence = this.formatSequence(counter.sequence);

    return `${prefix}${dateStr}${sequence}`;
  }

  async generateMarriageApplication(): Promise<string> {
    const prefix = "M";
    const dateStr = this.getDateString();
    const key = `${prefix}${dateStr}`;
    const counter = await this.counterRepo.increment(key);
    const sequence = this.formatSequence(counter.sequence);

    return `${prefix}${dateStr}${sequence}`;
  }

  async generateDeathApplication(): Promise<string> {
    const prefix = "D";
    const dateStr = this.getDateString();
    const key = `${prefix}${dateStr}`;
    const counter = await this.counterRepo.increment(key);
    const sequence = this.formatSequence(counter.sequence);

    return `${prefix}${dateStr}${sequence}`;
  }
}