import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  async getDashboard(
    @Query('type') type?: string,
  ) {
    return await this.dashboardService.getDashboard(type);
  }
}