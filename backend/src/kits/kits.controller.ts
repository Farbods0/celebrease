import { CreateKitDto } from "@/kits/dto/create-kit.dto";
import { AddKitItemDto, AddKitPreviewItemDto, ReorderKitPreviewItemsDto } from "@/kits/dto/kit-item.dto";
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

    @Post(":id/items")
    @Roles(["admin", "superadmin"])
    addItem(@Param("id") id: string, @Body() dto: AddKitItemDto) {
        return this.kitsService.addItem(id, dto);
    }

    @Delete(":id/items/:kitItemId")
    @Roles(["admin", "superadmin"])
    removeItem(@Param("id") id: string, @Param("kitItemId") kitItemId: string) {
        return this.kitsService.removeItem(id, kitItemId);
    }

    @Post(":id/preview-items")
    @Roles(["admin", "superadmin"])
    addPreviewItem(@Param("id") id: string, @Body() dto: AddKitPreviewItemDto) {
        return this.kitsService.addPreviewItem(id, dto);
    }

    @Delete(":id/preview-items/:previewItemId")
    @Roles(["admin", "superadmin"])
    removePreviewItem(@Param("id") id: string, @Param("previewItemId") previewItemId: string) {
        return this.kitsService.removePreviewItem(id, previewItemId);
    }

    @Patch(":id/preview-items/reorder")
    @Roles(["admin", "superadmin"])
    reorderPreviewItems(@Param("id") id: string, @Body() dto: ReorderKitPreviewItemsDto) {
        return this.kitsService.reorderPreviewItems(id, dto);
    }
}
