import { Controller, Post } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { AdminSeed } from "./admin.seed";

@Controller('seed')
export class SeedController {

    constructor(
        private readonly seedService: SeedService,
        private readonly adminSeed: AdminSeed,
    ){}

    @Post()
    async seedDatabase() {
        return await this.seedService.seed();
    }

     @Post('admin')
    async seedAdmin() {
      await this.adminSeed.seed();

    return {
      message: 'Admin seeded successfully',
    };
  }
}