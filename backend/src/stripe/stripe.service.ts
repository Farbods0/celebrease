import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import StripeLib from "stripe";

type StripeClient = InstanceType<typeof StripeLib>;
export type StripeEvent = ReturnType<StripeClient["webhooks"]["constructEvent"]>;
export type StripeSubscription = Awaited<ReturnType<StripeClient["subscriptions"]["retrieve"]>>;
export type StripeCheckoutSession = Awaited<ReturnType<StripeClient["checkout"]["sessions"]["retrieve"]>>;
export type StripePaymentMethod = Awaited<ReturnType<StripeClient["paymentMethods"]["retrieve"]>>;

@Injectable()
export class StripeService {
    readonly client: StripeClient;
    private readonly webhookSecret: string;

    constructor(private readonly config: ConfigService) {
        this.client = new StripeLib(this.config.getOrThrow<string>("stripe.secretKey"));
        this.webhookSecret = this.config.getOrThrow<string>("stripe.webhookSecret");
    }

    constructEvent(rawBody: Buffer, signature: string): StripeEvent {
        return this.client.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    }

    retrievePaymentMethod(id: string): Promise<StripePaymentMethod> {
        return this.client.paymentMethods.retrieve(id);
    }

    async ensureCustomer(args: { userId: string; email: string; name: string; existingId: string | null }): Promise<string> {
        if (args.existingId) return args.existingId;

        const customer = await this.client.customers.create({
            email: args.email,
            name: args.name,
            metadata: { userId: args.userId },
        });
        return customer.id;
    }

    createSubscriptionCheckoutSession(args: {
        customerId: string;
        priceId: string;
        userId: string;
        planId: string;
        billingCycle: "MONTHLY" | "YEARLY";
    }) {
        return this.client.checkout.sessions.create({
            mode: "subscription",
            customer: args.customerId,
            line_items: [{ price: args.priceId, quantity: 1 }],
            success_url: this.config.getOrThrow<string>("stripe.successUrl"),
            cancel_url: this.config.getOrThrow<string>("stripe.cancelUrl"),
            metadata: {
                kind: "subscription",
                userId: args.userId,
                planId: args.planId,
                billingCycle: args.billingCycle,
            },
        });
    }

    createOrderCheckoutSession(args: {
        customerId: string;
        userId: string;
        orderIds: string[];
        lineItems: { name: string; description?: string; unitAmountCents: number; quantity: number }[];
    }) {
        return this.client.checkout.sessions.create({
            mode: "payment",
            customer: args.customerId,
            line_items: args.lineItems.map((li) => ({
                quantity: li.quantity,
                price_data: {
                    currency: "usd",
                    unit_amount: li.unitAmountCents,
                    product_data: {
                        name: li.name,
                        ...(li.description ? { description: li.description } : {}),
                    },
                },
            })),
            payment_intent_data: {
                metadata: {
                    kind: "order",
                    userId: args.userId,
                    orderIds: args.orderIds.join(","),
                },
            },
            success_url: this.config.getOrThrow<string>("stripe.successUrl"),
            cancel_url: this.config.getOrThrow<string>("stripe.cancelUrl"),
            metadata: {
                kind: "order",
                userId: args.userId,
                orderIds: args.orderIds.join(","),
            },
        });
    }
}
