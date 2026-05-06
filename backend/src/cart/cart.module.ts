import { CartController } from "@/cart/cart.controller";
import { CartService } from "@/cart/cart.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}
