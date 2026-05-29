import { CreatePlanDto } from "@/plans/dto/create-plan.dto";
import { UpdatePlanDto } from "@/plans/dto/update-plan.dto";
import { PlansService } from "@/plans/plans.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

@Controller("/plan")
export class PlansController {
    constructor(private readonly plansService: PlansService) {}

    @Get()
    @AllowAnonymous()
    list() {
        return this.plansService.list();
    }

    @Get("admin")
    @Roles(["admin", "superadmin"])
    listAll() {
        return this.plansService.listAll();
    }

    @Get(":id")
    @Roles(["admin", "superadmin"])
    get(@Param("id") id: string) {
        return this.plansService.getById(id);
    }

    @Post()
    @Roles(["admin", "superadmin"])
    create(@Body() dto: CreatePlanDto) {
        return this.plansService.create(dto);
    }

    @Patch(":id")
    @Roles(["admin", "superadmin"])
    update(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
        return this.plansService.update(id, dto);
    }

    @Delete(":id")
    @Roles(["admin", "superadmin"])
    remove(@Param("id") id: string) {
        return this.plansService.remove(id);
    }
}
