import { CreateCheckoutDto } from "@/orders/dto/create-checkout.dto";
import { InspectReturnDto } from "@/orders/dto/inspect-return.dto";
import { ListOrdersDto } from "@/orders/dto/list-orders.dto";
import { SetReturnLabelDto } from "@/orders/dto/set-return-label.dto";
import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";
import { OrdersService } from "@/orders/orders.service";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
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

    @Patch("/me/:id/cancel")
    cancelMine(@Param("id") id: string, @Session() session: UserSession) {
        return this.orders.cancelMine(session.user.id, id);
    }

    @Post("/me/:id/retry-payment")
    retryPayment(@Param("id") id: string, @Session() session: UserSession) {
        return this.orders.retryPayment(session.user.id, id);
    }

    @Post("/me/:id/return")
    requestReturn(@Param("id") id: string, @Session() session: UserSession) {
        return this.orders.requestReturn(session.user.id, id);
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

    @Patch("/admin/:id/status")
    @Roles(["admin", "superadmin"])
    updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.orders.updateStatus(id, dto);
    }

    @Patch("/admin/:id/return-label")
    @Roles(["admin", "superadmin"])
    setReturnLabel(@Param("id") id: string, @Body() dto: SetReturnLabelDto) {
        return this.orders.setReturnLabel(id, dto);
    }

    @Post("/admin/:id/inspect")
    @Roles(["admin", "superadmin"])
    inspectReturn(@Param("id") id: string, @Body() dto: InspectReturnDto) {
        return this.orders.inspectReturn(id, dto);
    }

    @Patch("/admin/:id/complete")
    @Roles(["admin", "superadmin"])
    completeInspected(@Param("id") id: string) {
        return this.orders.completeInspected(id);
    }

    @Post("/checkout")
    createCheckout(@Body() dto: CreateCheckoutDto, @Session() session: UserSession) {
        return this.orders.createCheckout(dto, session);
    }
}
