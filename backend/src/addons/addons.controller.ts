import { AddOnsService } from "@/addons/addons.service";
import { CreateAddOnDto } from "@/addons/dto/create-addon.dto";
import { UpdateAddOnDto } from "@/addons/dto/update-addon.dto";
import { AdjustStockDto } from "@/inventory/dto/adjust-stock.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

@Controller("addons")
export class AddOnsController {
    constructor(private readonly addOnsService: AddOnsService) {}

    @Get()
    @AllowAnonymous()
    list() {
        return this.addOnsService.list();
    }

    @Get("admin")
    @Roles(["admin", "superadmin"])
    listAll() {
        return this.addOnsService.listAll();
    }

    @Get(":id")
    @Roles(["admin", "superadmin"])
    get(@Param("id") id: string) {
        return this.addOnsService.getById(id);
    }

    @Post()
    @Roles(["admin", "superadmin"])
    create(@Body() dto: CreateAddOnDto) {
        return this.addOnsService.create(dto);
    }

    @Patch(":id")
    @Roles(["admin", "superadmin"])
    update(@Param("id") id: string, @Body() dto: UpdateAddOnDto) {
        return this.addOnsService.update(id, dto);
    }

    @Delete(":id")
    @Roles(["admin", "superadmin"])
    remove(@Param("id") id: string) {
        return this.addOnsService.remove(id);
    }

    @Patch(":id/adjust-stock")
    @Roles(["admin", "superadmin"])
    adjustStock(@Param("id") id: string, @Body() dto: AdjustStockDto) {
        return this.addOnsService.adjustStock(id, dto);
    }
}
