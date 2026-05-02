import { CreateCheckoutDto } from "@/subscriptions/dto/checkout.dto";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("/subscription")
export class SubscriptionsController {
    constructor(private readonly subscriptions: SubscriptionsService) {}

    @Get("/me")
    getMine(@Session() session: UserSession) {
        return this.subscriptions.getMine(session);
    }

    @Post("/checkout")
    createCheckout(@Body() dto: CreateCheckoutDto, @Session() session: UserSession) {
        return this.subscriptions.createCheckout(dto, session);
    }
}
