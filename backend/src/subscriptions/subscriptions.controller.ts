import { CreateCheckoutDto } from "@/subscriptions/dto/checkout.dto";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("/subscription")
export class SubscriptionsController {
    constructor(private readonly subscriptions: SubscriptionsService) {}

    @Get("/me")
    getMine(@Session() session: UserSession) {
        return this.subscriptions.getMine(session);
    }

    @Get("/admin")
    @Roles(["admin", "superadmin"])
    listAll() {
        return this.subscriptions.listAll();
    }

    @Get("/admin/:id")
    @Roles(["admin", "superadmin"])
    getById(@Param("id") id: string) {
        return this.subscriptions.getById(id);
    }

    @Post("/checkout")
    createCheckout(@Body() dto: CreateCheckoutDto, @Session() session: UserSession) {
        return this.subscriptions.createCheckout(dto, session);
    }
}
