import { InventoryModule } from "@/inventory/inventory.module";
import { OrdersController } from "@/orders/orders.controller";
import { OrdersService } from "@/orders/orders.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [InventoryModule],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
