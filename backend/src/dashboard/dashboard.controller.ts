import { DashboardService } from "@/dashboard/dashboard.service";
import { Controller, Get } from "@nestjs/common";
import { Roles } from "@thallesp/nestjs-better-auth";

@Controller("dashboard")
export class DashboardController {
    constructor(private readonly dashboard: DashboardService) {}

    @Get("stats")
    @Roles(["admin", "superadmin"])
    getStats() {
        return this.dashboard.getStats();
    }
}
