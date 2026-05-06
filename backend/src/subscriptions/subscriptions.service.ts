import { PrismaService } from "@/common/services/prisma.service";
import { BillingCycle, SubscriptionStatus } from "@/generated/prisma/enums";
import { type StripeCheckoutSession, type StripeSubscription, StripeService } from "@/stripe/stripe.service";
import { CreateCheckoutDto } from "@/subscriptions/dto/checkout.dto";
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { UserSession } from "@thallesp/nestjs-better-auth";

const subscriptionInclude = {
    plan: { select: { id: true, code: true, name: true, holidaysPerYear: true } },
    holidaySlots: {
        orderBy: { slotNumber: "asc" as const },
        select: { id: true, slotNumber: true, status: true, holidayId: true, orderId: true },
    },
} as const;

const adminSubscriptionInclude = {
    user: { select: { id: true, name: true, email: true } },
    plan: { select: { id: true, code: true, name: true, holidaysPerYear: true } },
    holidaySlots: {
        orderBy: { slotNumber: "asc" as const },
        include: { holiday: { select: { id: true, name: true } } },
    },
} as const;

const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ["ACTIVE" as SubscriptionStatus, "PAUSED" as SubscriptionStatus];

function mapStripeStatus(status: StripeSubscription["status"]): SubscriptionStatus {
    switch (status) {
        case "active":
        case "trialing":
            return "ACTIVE" as SubscriptionStatus;
        case "paused":
            return "PAUSED" as SubscriptionStatus;
        case "canceled":
            return "CANCELLED" as SubscriptionStatus;
        case "incomplete":
        case "incomplete_expired":
        case "past_due":
        case "unpaid":
            return "EXPIRED" as SubscriptionStatus;
        default:
            return "ACTIVE" as SubscriptionStatus;
    }
}

@Injectable()
export class SubscriptionsService {
    private readonly logger = new Logger(SubscriptionsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly stripe: StripeService,
    ) {}

    async getMine(session: UserSession) {
        const sub = await this.prisma.subscription.findFirst({
            where: { userId: session.user.id, status: { in: ACTIVE_SUBSCRIPTION_STATUSES } },
            include: subscriptionInclude,
            orderBy: { createdAt: "desc" },
        });
        return sub ?? null;
    }

    async getPaymentMethod(session: UserSession) {
        const user = await this.prisma.user.findUnique({
            where: { id: session.user.id },
            select: { stripeCustomerId: true },
        });

        if (!user?.stripeCustomerId) throw new BadRequestException("User not found");

        const methods = await this.stripe.client.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: "card",
            limit: 1,
        });

        if (methods.data.length === 0) throw new BadRequestException("No payment method found");

        const card = methods.data[0].card;
        return {
            brand: card?.brand,
            last4: card?.last4,
            expMonth: card?.exp_month,
            expYear: card?.exp_year,
        };
    }

    async listAll() {
        const items = await this.prisma.subscription.findMany({
            include: adminSubscriptionInclude,
            orderBy: { createdAt: "desc" },
        });
        return { items };
    }

    async getById(id: string) {
        const sub = await this.prisma.subscription.findUnique({
            where: { id },
            include: adminSubscriptionInclude,
        });
        if (!sub) throw new NotFoundException("Subscription not found");
        return sub;
    }

    async createCheckout(dto: CreateCheckoutDto, session: UserSession) {
        const existingActive = await this.prisma.subscription.findFirst({
            where: { userId: session.user.id, status: { in: ACTIVE_SUBSCRIPTION_STATUSES } },
            select: { id: true },
        });
        if (existingActive) throw new ConflictException("You already have an active subscription");

        const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
        if (!plan || !plan.isActive) throw new NotFoundException("Plan not found");

        const priceId = dto.billingCycle === "YEARLY" ? plan.stripePriceYearlyId : plan.stripePriceMonthlyId;
        if (!priceId) {
            throw new BadRequestException(`Plan "${plan.name}" has no ${dto.billingCycle.toLowerCase()} Stripe price configured`);
        }

        const user = await this.prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, email: true, name: true, stripeCustomerId: true },
        });
        if (!user) throw new NotFoundException("User not found");

        const customerId = await this.stripe.ensureCustomer({
            userId: user.id,
            email: user.email,
            name: user.name,
            existingId: user.stripeCustomerId,
        });

        if (customerId !== user.stripeCustomerId) {
            await this.prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
        }

        const checkout = await this.stripe.createSubscriptionCheckoutSession({
            customerId,
            priceId,
            userId: user.id,
            planId: plan.id,
            billingCycle: dto.billingCycle,
        });

        return { url: checkout.url };
    }

    async onCheckoutCompleted(session: StripeCheckoutSession) {
        const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        if (!stripeSubscriptionId) {
            this.logger.warn(`checkout.session.completed without subscription (mode=${session.mode})`);
            return;
        }

        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const billingCycle = session.metadata?.billingCycle as BillingCycle | undefined;
        if (!userId || !planId || !billingCycle) {
            this.logger.error(`Checkout session missing metadata: ${session.id}`);
            return;
        }

        const stripeSub = await this.stripe.client.subscriptions.retrieve(stripeSubscriptionId, {
            expand: ["default_payment_method"],
        });
        const item = stripeSub.items.data[0];

        const existing = await this.prisma.subscription.findUnique({ where: { stripeSubscriptionId } });
        if (existing) {
            this.logger.log(`Subscription ${stripeSubscriptionId} already provisioned, skipping`);
            return;
        }

        const plan = await this.prisma.plan.findUnique({
            where: { id: planId },
            select: { holidaysPerYear: true },
        });
        if (!plan) {
            this.logger.error(`Plan ${planId} not found while provisioning ${stripeSubscriptionId}`);
            return;
        }

        await this.prisma.subscription.create({
            data: {
                userId,
                planId,
                billingCycle,
                status: mapStripeStatus(stripeSub.status),
                stripeSubscriptionId,
                cycleStart: item?.current_period_start ? new Date(item.current_period_start * 1000) : null,
                cycleEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
                nextBillingAt: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
                holidaySlots: {
                    create: Array.from({ length: plan.holidaysPerYear }, (_, i) => ({ slotNumber: i + 1 })),
                },
            },
        });

        this.logger.log(`Provisioned subscription ${stripeSubscriptionId} for user ${userId}`);
    }

    async onSubscriptionUpdated(stripeSub: StripeSubscription) {
        const local = await this.prisma.subscription.findUnique({ where: { stripeSubscriptionId: stripeSub.id } });
        if (!local) {
            this.logger.warn(`subscription.updated for unknown ${stripeSub.id} — likely arrived before checkout.completed`);
            return;
        }

        const item = stripeSub.items.data[0];

        await this.prisma.subscription.update({
            where: { stripeSubscriptionId: stripeSub.id },
            data: {
                status: mapStripeStatus(stripeSub.status),
                cycleStart: item?.current_period_start ? new Date(item.current_period_start * 1000) : null,
                cycleEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
                nextBillingAt: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
                cancelledAt: stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000) : null,
            },
        });
    }

    async onSubscriptionDeleted(stripeSub: StripeSubscription) {
        const local = await this.prisma.subscription.findUnique({ where: { stripeSubscriptionId: stripeSub.id } });
        if (!local) return;

        await this.prisma.subscription.update({
            where: { stripeSubscriptionId: stripeSub.id },
            data: {
                status: "CANCELLED" as SubscriptionStatus,
                cancelledAt: new Date(),
            },
        });
    }
}
