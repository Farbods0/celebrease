import { InventoryAllocationService } from "@/inventory/inventory-allocation.service";
import { InventoryController } from "@/inventory/inventory.controller";
import { InventoryService } from "@/inventory/inventory.service";
import { UploadModule } from "@/upload/upload.module";
import { Module } from "@nestjs/common";

@Module({
    imports: [UploadModule],
    controllers: [InventoryController],
    providers: [InventoryService, InventoryAllocationService],
    exports: [InventoryService, InventoryAllocationService],
})
export class InventoryModule {}
