import { DashboardController } from "@/dashboard/dashboard.controller";
import { DashboardService } from "@/dashboard/dashboard.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
