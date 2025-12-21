import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  // Get dashboard statistics
  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}
