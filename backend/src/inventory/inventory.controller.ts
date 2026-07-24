import { AdjustStockDto } from "@/inventory/dto/adjust-stock.dto";
import { CreateItemDto } from "@/inventory/dto/create-item.dto";
import { UpdateItemDto } from "@/inventory/dto/update-item.dto";
import { InventoryService } from "@/inventory/inventory.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

@Controller("inventory")
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Get()
    @AllowAnonymous()
    list() {
        return this.inventoryService.list();
    }

    @Get("admin")
    @Roles(["admin", "superadmin"])
    listAll() {
        return this.inventoryService.listAll();
    }

    @Get(":id")
    @Roles(["admin", "superadmin"])
    get(@Param("id") id: string) {
        return this.inventoryService.getById(id);
    }

    @Post()
    @Roles(["admin", "superadmin"])
    create(@Body() dto: CreateItemDto) {
        return this.inventoryService.create(dto);
    }

    @Patch(":id")
    @Roles(["admin", "superadmin"])
    update(@Param("id") id: string, @Body() dto: UpdateItemDto) {
        return this.inventoryService.update(id, dto);
    }

    @Delete(":id")
    @Roles(["admin", "superadmin"])
    remove(@Param("id") id: string) {
        return this.inventoryService.remove(id);
    }

    @Patch(":id/adjust-stock")
    @Roles(["admin", "superadmin"])
    adjustStock(@Param("id") id: string, @Body() dto: AdjustStockDto) {
        return this.inventoryService.adjustStock(id, dto);
    }
}
