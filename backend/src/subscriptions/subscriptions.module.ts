import { StripeWebhookController } from "@/subscriptions/stripe-webhook.controller";
import { SubscriptionsController } from "@/subscriptions/subscriptions.controller";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [SubscriptionsController, StripeWebhookController],
    providers: [SubscriptionsService],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
