import { OrdersService } from "@/orders/orders.service";
import { type StripeCheckoutSession, type StripeEvent, type StripeSubscription, StripeService } from "@/stripe/stripe.service";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { BadRequestException, Controller, Headers, HttpCode, Logger, Post, Req } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import type { Request } from "express";

@Controller("/stripe")
export class StripeWebhookController {
    private readonly logger = new Logger(StripeWebhookController.name);

    constructor(
        private readonly stripe: StripeService,
        private readonly subs: SubscriptionsService,
        private readonly orders: OrdersService,
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
            this.logger.error(`Webhook signature verification failed: ${(err as Error).message}`);
            throw new BadRequestException(`Webhook signature failed: ${(err as Error).message}`);
        }

        this.logger.log(`📩 Stripe webhook received: ${event.type} (${event.id})`);

        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    const session = event.data.object as StripeCheckoutSession;
                    const kind = session.metadata?.kind;
                    if (kind === "order") {
                        await this.orders.onCheckoutCompleted(session);
                    } else {
                        await this.subs.onCheckoutCompleted(session);
                    }
                    break;
                }
                case "customer.subscription.updated":
                    await this.subs.onSubscriptionUpdated(event.data.object as StripeSubscription);
                    break;
                case "customer.subscription.deleted":
                    await this.subs.onSubscriptionDeleted(event.data.object as StripeSubscription);
                    break;
                default:
                    this.logger.debug(`Unhandled event type: ${event.type}`);
                    break;
            }
        } catch (err) {
            this.logger.error(`Failed to process ${event.type} (${event.id}): ${(err as Error).message}`, (err as Error).stack);
            // Re-throw so Stripe gets a 500 and retries the event
            throw err;
        }

        return { received: true };
    }
}
