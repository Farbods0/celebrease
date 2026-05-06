import { CreateCheckoutDto } from "@/orders/dto/create-checkout.dto";
import { ListOrdersDto } from "@/orders/dto/list-orders.dto";
import { OrdersService } from "@/orders/orders.service";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("/order")
export class OrdersController {
    constructor(private readonly orders: OrdersService) {}

    @Get("/me")
    listMine(@Query() query: ListOrdersDto, @Session() session: UserSession) {
        return this.orders.listMine(session.user.id, query);
    }

    @Get("/me/:id")
    getMine(@Param("id") id: string, @Session() session: UserSession) {
        return this.orders.getMine(session.user.id, id);
    }

    @Get("/admin")
    @Roles(["admin", "superadmin"])
    listAll(@Query() query: ListOrdersDto) {
        return this.orders.listAll(query);
    }

    @Get("/admin/:id")
    @Roles(["admin", "superadmin"])
    getById(@Param("id") id: string) {
        return this.orders.getById(id);
    }

    @Post("/checkout")
    createCheckout(@Body() dto: CreateCheckoutDto, @Session() session: UserSession) {
        return this.orders.createCheckout(dto, session);
    }
}
