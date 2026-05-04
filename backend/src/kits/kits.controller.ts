import { CreateKitDto } from "@/kits/dto/create-kit.dto";
import { UpdateKitDto } from "@/kits/dto/update-kit.dto";
import { KitsService } from "@/kits/kits.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

@Controller("kits")
export class KitsController {
    constructor(private readonly kitsService: KitsService) {}

    @Get()
    @AllowAnonymous()
    list(@Query("holidayId") holidayId?: string) {
        return this.kitsService.list(holidayId);
    }

    @Get("admin")
    @Roles(["admin", "superadmin"])
    listAll(@Query("holidayId") holidayId?: string) {
        return this.kitsService.listAll(holidayId);
    }

    @Get(":id")
    @Roles(["admin", "superadmin"])
    get(@Param("id") id: string) {
        return this.kitsService.getById(id);
    }

    @Post()
    @Roles(["admin", "superadmin"])
    create(@Body() dto: CreateKitDto) {
        return this.kitsService.create(dto);
    }

    @Patch(":id")
    @Roles(["admin", "superadmin"])
    update(@Param("id") id: string, @Body() dto: UpdateKitDto) {
        return this.kitsService.update(id, dto);
    }

    @Delete(":id")
    @Roles(["admin", "superadmin"])
    remove(@Param("id") id: string) {
        return this.kitsService.remove(id);
    }
}
