import { OrdersModule } from "@/orders/orders.module";
import { StripeWebhookController } from "@/subscriptions/stripe-webhook.controller";
import { SubscriptionsController } from "@/subscriptions/subscriptions.controller";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [OrdersModule],
    controllers: [SubscriptionsController, StripeWebhookController],
    providers: [SubscriptionsService],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
