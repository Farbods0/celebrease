import { CartService } from "@/cart/cart.service";
import { AddToCartDto } from "@/cart/dto/add-to-cart.dto";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("cart")
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    listMine(@Session() session: UserSession) {
        return this.cartService.listMine(session.user.id);
    }

    @Post()
    addToCart(@Body() dto: AddToCartDto, @Session() session: UserSession) {
        return this.cartService.addToCart(session.user.id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string, @Session() session: UserSession) {
        return this.cartService.remove(session.user.id, id);
    }
}
