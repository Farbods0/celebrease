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
        const secretKey = this.config.getOrThrow<string>("stripe.secretKey");
        this.client = new StripeLib(secretKey);
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

    async createProduct(args: { name: string; description?: string; planId: string }) {
        return this.client.products.create({
            name: args.name,
            description: args.description,
            metadata: { planId: args.planId },
        });
    }

    async updateProduct(productId: string, args: { name?: string; description?: string }) {
        return this.client.products.update(productId, {
            ...(args.name && { name: args.name }),
            ...(args.description && { description: args.description }),
        });
    }

    async archiveProduct(productId: string) {
        return this.client.products.update(productId, { active: false });
    }

    async createPrice(args: {
        productId: string;
        unitAmountCents: number;
        currency?: string;
        interval: "month" | "year";
        metadata?: Record<string, string>;
    }) {
        return this.client.prices.create({
            product: args.productId,
            unit_amount: args.unitAmountCents,
            currency: args.currency ?? "usd",
            recurring: { interval: args.interval },
            metadata: args.metadata,
        });
    }

    async archivePrice(priceId: string) {
        return this.client.prices.update(priceId, { active: false });
    }

    async updatePrice(priceId: string, unitAmountCents: number) {
        const oldPrice = await this.client.prices.retrieve(priceId);
        const newPrice = await this.client.prices.create({
            product: oldPrice.product as string,
            unit_amount: unitAmountCents,
            currency: oldPrice.currency,
            recurring: { interval: oldPrice.recurring?.interval as "month" | "year" },
            metadata: oldPrice.metadata,
        });
        await this.client.prices.update(priceId, { active: false });
        return newPrice;
    }
}
