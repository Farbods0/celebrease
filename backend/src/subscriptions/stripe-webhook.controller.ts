import { type StripeCheckoutSession, type StripeEvent, type StripeSubscription, StripeService } from "@/stripe/stripe.service";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { BadRequestException, Controller, Headers, HttpCode, Post, Req } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import type { Request } from "express";

@Controller("/stripe")
export class StripeWebhookController {
    constructor(
        private readonly stripe: StripeService,
        private readonly subs: SubscriptionsService,
    ) {}

    @Post("/webhook")
    @AllowAnonymous()
    @HttpCode(200)
    async webhook(@Req() req: Request & { rawBody?: Buffer }, @Headers("stripe-signature") signature: string) {
        if (!signature) throw new BadRequestException("Missing stripe-signature header");
        if (!req.rawBody) throw new BadRequestException("Missing raw body");

        let event: StripeEvent;
        try {
            event = this.stripe.constructEvent(req.rawBody, signature);
        } catch (err) {
            throw new BadRequestException(`Webhook signature failed: ${(err as Error).message}`);
        }

        switch (event.type) {
            case "checkout.session.completed":
                await this.subs.onCheckoutCompleted(event.data.object as StripeCheckoutSession);
                break;
            case "customer.subscription.updated":
                await this.subs.onSubscriptionUpdated(event.data.object as StripeSubscription);
                break;
            case "customer.subscription.deleted":
                await this.subs.onSubscriptionDeleted(event.data.object as StripeSubscription);
                break;
            default:
                break;
        }

        return { received: true };
    }
}
