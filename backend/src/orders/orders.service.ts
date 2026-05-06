import { PrismaService } from "@/common/services/prisma.service";
import { Prisma } from "@/generated/prisma/client";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { CreateCheckoutDto, DeliveryOption } from "@/orders/dto/create-checkout.dto";
import { ListOrdersDto } from "@/orders/dto/list-orders.dto";
import { type StripeCheckoutSession, StripeService } from "@/stripe/stripe.service";
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { UserSession } from "@thallesp/nestjs-better-auth";
import { randomBytes } from "node:crypto";

const TAX_RATE = new Prisma.Decimal("0.08");
const SHIPPING_FEES: Record<DeliveryOption, Prisma.Decimal> = {
    STANDARD: new Prisma.Decimal("15.00"),
    EXPRESS: new Prisma.Decimal("25.00"),
};

const ZERO = new Prisma.Decimal(0);

const orderInclude = {
    kit: { select: { id: true, sku: true, tier: true } },
    holiday: { select: { id: true, name: true, image: true, category: true } },
    items: {
        select: {
            qty: true,
            item: { select: { id: true, sku: true, name: true, image: true, category: true } },
        },
    },
    addOns: {
        select: {
            qty: true,
            price: true,
            deposit: true,
            addOn: { select: { id: true, sku: true, name: true, image: true } },
        },
    },
} as const;

const adminOrderInclude = {
    ...orderInclude,
    user: { select: { id: true, name: true, email: true } },
} as const;

const cartCheckoutInclude = {
    kit: { select: { id: true, sku: true, tier: true } },
    holiday: { select: { id: true, name: true } },
    items: { select: { itemId: true, qty: true } },
    addOns: { select: { addOnId: true, qty: true, price: true, deposit: true } },
} as const;

function decimalToCents(value: Prisma.Decimal | string | number): number {
    return new Prisma.Decimal(value).times(100).round().toNumber();
}

function generateOrderNumber(): string {
    const today = new Date();
    const yyyy = today.getUTCFullYear();
    const mm = String(today.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(today.getUTCDate()).padStart(2, "0");
    const suffix = randomBytes(2).toString("hex").toUpperCase();
    return `ORD-${yyyy}${mm}${dd}-${suffix}`;
}

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly stripe: StripeService,
    ) {}

    async listMine(userId: string, query: ListOrdersDto) {
        const { page, limit } = query;
        const skip = (page - 1) * limit;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where: { userId },
                include: orderInclude,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);

        return { items, total };
    }

    async getMine(userId: string, id: string) {
        const order = await this.prisma.order.findUnique({ where: { id }, include: orderInclude });
        if (!order) throw new NotFoundException("Order not found");
        if (order.userId !== userId) throw new ForbiddenException("Not your order");
        return order;
    }

    async listAll(query: ListOrdersDto) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = search
            ? {
                  OR: [
                      { orderNumber: { contains: search, mode: "insensitive" } },
                      { user: { email: { contains: search, mode: "insensitive" } } },
                      { user: { name: { contains: search, mode: "insensitive" } } },
                  ],
              }
            : {};

        const [items, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where,
                include: adminOrderInclude,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);

        return { items, total };
    }

    async getById(id: string) {
        const order = await this.prisma.order.findUnique({ where: { id }, include: adminOrderInclude });
        if (!order) throw new NotFoundException("Order not found");
        return order;
    }

    async createCheckout(dto: CreateCheckoutDto, session: UserSession) {
        const userId = session.user.id;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, stripeCustomerId: true, address: true },
        });
        if (!user) throw new NotFoundException("User not found");
        if (!user.address) {
            throw new BadRequestException("Please save a shipping address before checkout");
        }

        const carts = await this.prisma.cart.findMany({
            where: { id: { in: dto.cartIds }, userId },
            include: cartCheckoutInclude,
        });
        if (carts.length !== dto.cartIds.length) {
            throw new NotFoundException("One or more cart items not found");
        }

        const shippingFee = SHIPPING_FEES[dto.deliveryOption];

        const taxableSubtotal = carts.reduce((acc, c) => acc.plus(c.rentalFee).plus(c.extendedFee).plus(c.addOnsFee), ZERO);
        const totalTax = taxableSubtotal.times(TAX_RATE);

        const carryoverShipping = shippingFee;
        const carryoverTax = totalTax;

        const customerId = await this.stripe.ensureCustomer({
            userId: user.id,
            email: user.email,
            name: user.name,
            existingId: user.stripeCustomerId,
        });
        if (customerId !== user.stripeCustomerId) {
            await this.prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
        }

        const created = await this.prisma.$transaction(async (tx) => {
            const orders: { id: string; total: Prisma.Decimal; kitName: string; holidayName: string }[] = [];

            for (let i = 0; i < carts.length; i++) {
                const cart = carts[i];

                // Distribute tax/shipping across orders: first order takes any remainder so totals stay exact.
                const isLast = i === carts.length - 1;
                const orderTax = isLast ? carryoverTax : new Prisma.Decimal(0);
                const orderShipping = isLast ? carryoverShipping : new Prisma.Decimal(0);

                const cartSubtotal = cart.rentalFee
                    .plus(cart.extendedFee)
                    .plus(cart.kitDeposit)
                    .plus(cart.addOnsFee)
                    .plus(cart.addOnDeposit);
                const orderTotal = cartSubtotal.plus(orderTax).plus(orderShipping);

                let orderNumber = generateOrderNumber();
                for (let attempt = 0; attempt < 5; attempt++) {
                    const collision = await tx.order.findUnique({
                        where: { orderNumber },
                        select: { id: true },
                    });
                    if (!collision) break;
                    orderNumber = generateOrderNumber();
                }

                const order = await tx.order.create({
                    data: {
                        orderNumber,
                        userId,
                        kitId: cart.kitId,
                        holidayId: cart.holidayId,
                        duration: cart.duration,
                        startDate: cart.startDate,
                        endDate: cart.endDate,
                        rentalFee: cart.rentalFee,
                        extendedFee: cart.extendedFee,
                        kitDeposit: cart.kitDeposit,
                        addOnsFee: cart.addOnsFee,
                        addOnDeposit: cart.addOnDeposit,
                        total: orderTotal,
                        tax: orderTax,
                        shippingFee: orderShipping,
                        status: "PENDING" as OrderStatus,
                        paymentStatus: "PENDING" as PaymentStatus,
                        items: {
                            create: cart.items.map((ci) => ({ itemId: ci.itemId, qty: ci.qty })),
                        },
                        addOns: cart.addOns.length
                            ? {
                                  create: cart.addOns.map((a) => ({
                                      addOnId: a.addOnId,
                                      qty: a.qty,
                                      price: a.price,
                                      deposit: a.deposit,
                                  })),
                              }
                            : undefined,
                    },
                    include: { kit: { select: { tier: true } }, holiday: { select: { name: true } } },
                });

                orders.push({
                    id: order.id,
                    total: orderTotal,
                    kitName: `${order.holiday.name} ${order.kit.tier} Kit`,
                    holidayName: order.holiday.name,
                });
            }

            await tx.cart.deleteMany({ where: { id: { in: dto.cartIds }, userId } });

            return orders;
        });

        const lineItems = created.map((o) => ({
            name: o.kitName,
            description: `Order ${o.holidayName}`,
            unitAmountCents: decimalToCents(o.total),
            quantity: 1,
        }));

        const checkout = await this.stripe.createOrderCheckoutSession({
            customerId,
            userId,
            orderIds: created.map((o) => o.id),
            lineItems,
        });

        return { url: checkout.url, orderIds: created.map((o) => o.id) };
    }

    async onCheckoutCompleted(session: StripeCheckoutSession) {
        const orderIdsRaw = session.metadata?.orderIds;
        const userId = session.metadata?.userId;
        if (!orderIdsRaw || !userId) {
            this.logger.error(`Order checkout session missing metadata: ${session.id}`);
            return;
        }

        const orderIds = orderIdsRaw.split(",").filter(Boolean);
        if (!orderIds.length) {
            this.logger.error(`Order checkout session has empty orderIds: ${session.id}`);
            return;
        }

        const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

        let chargeId: string | null = null;
        if (paymentIntentId) {
            try {
                const pi = await this.stripe.client.paymentIntents.retrieve(paymentIntentId);
                chargeId = typeof pi.latest_charge === "string" ? pi.latest_charge : (pi.latest_charge?.id ?? null);
            } catch (err) {
                this.logger.warn(`Failed to retrieve PaymentIntent ${paymentIntentId}: ${(err as Error).message}`);
            }
        }

        const now = new Date();

        await this.prisma.$transaction(async (tx) => {
            for (let i = 0; i < orderIds.length; i++) {
                const id = orderIds[i];
                const order = await tx.order.findUnique({ where: { id }, select: { id: true, paymentStatus: true } });
                if (!order) {
                    this.logger.warn(`Order ${id} not found while finalizing payment for session ${session.id}`);
                    continue;
                }
                if (order.paymentStatus === ("PAID" as PaymentStatus)) {
                    continue;
                }

                await tx.order.update({
                    where: { id },
                    data: {
                        paymentStatus: "PAID" as PaymentStatus,
                        paidAt: now,
                        stripePaymentIntentId: i === 0 ? (paymentIntentId ?? null) : null,
                        stripeChargeId: chargeId,
                    },
                });
            }
        });

        this.logger.log(`Finalized ${orderIds.length} order(s) from session ${session.id}`);
    }
}
