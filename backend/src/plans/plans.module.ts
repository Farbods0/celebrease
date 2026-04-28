import { PlansController } from "@/plans/plans.controller";
import { PlansService } from "@/plans/plans.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [PlansController],
    providers: [PlansService],
})
export class PlansModule {}
