import { PrismaService } from "@/common/services/prisma.service";
import { Prisma } from "@/generated/prisma/client";
import { HolidaySlotStatus, OrderStatus, PaymentStatus, SubscriptionStatus } from "@/generated/prisma/enums";
import { CreateCheckoutDto, DeliveryOption } from "@/orders/dto/create-checkout.dto";
import { ListOrdersDto } from "@/orders/dto/list-orders.dto";
import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";
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
    user: {
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: { select: { phone: true } },
        },
    },
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

/**
 * Valid admin status transitions:
 *   PENDING  → RESERVED | CANCELLED
 *   RESERVED → SHIPPED  | CANCELLED
 *   SHIPPED  → DELIVERED | CANCELLED
 *   DELIVERED → COMPLETED
 */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["RESERVED", "CANCELLED"],
    RESERVED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["COMPLETED"],
};

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly stripe: StripeService,
    ) {}

    // ─── User: list my orders ───────────────────────────────────────────
    async listMine(userId: string, query: ListOrdersDto) {
        const { page, limit, filter } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = { userId };
        if (filter === "active") {
            where.status = { in: ["PENDING", "SHIPPED", "DELIVERED", "RESERVED"] };
        } else if (filter === "recent") {
            where.status = { in: ["COMPLETED", "CANCELLED"] };
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where,
                include: orderInclude,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);

        return { items, total };
    }

    // ─── User: get single order ─────────────────────────────────────────
    async getMine(userId: string, id: string) {
        const order = await this.prisma.order.findUnique({ where: { id }, include: orderInclude });
        if (!order) throw new NotFoundException("Order not found");
        if (order.userId !== userId) throw new ForbiddenException("Not your order");
        return order;
    }

    // ─── User: cancel own order (only if PENDING payment) ───────────────
    async cancelMine(userId: string, id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { id: true, userId: true, status: true, paymentStatus: true },
        });
        if (!order) throw new NotFoundException("Order not found");
        if (order.userId !== userId) throw new ForbiddenException("Not your order");

        if (order.status === ("CANCELLED" as OrderStatus)) {
            throw new BadRequestException("Order is already cancelled");
        }

        // Users can only cancel if payment is still pending
        if (order.paymentStatus !== ("PENDING" as PaymentStatus)) {
            throw new BadRequestException("Cannot cancel a paid order. Please contact support.");
        }

        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                status: "CANCELLED" as OrderStatus,
                cancelledAt: new Date(),
            },
            include: orderInclude,
        });

        return updated;
    }

    // ─── User: retry payment for a pending-payment order ────────────────
    async retryPayment(userId: string, id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                kit: { select: { tier: true } },
                holiday: { select: { name: true } },
            },
        });
        if (!order) throw new NotFoundException("Order not found");
        if (order.userId !== userId) throw new ForbiddenException("Not your order");

        if (order.paymentStatus !== ("PENDING" as PaymentStatus)) {
            throw new BadRequestException("Payment is not pending");
        }
        if (order.status === ("CANCELLED" as OrderStatus)) {
            throw new BadRequestException("Order has been cancelled");
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, stripeCustomerId: true },
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

        const kitName = `${order.holiday.name} ${order.kit.tier} Kit`;
        const checkout = await this.stripe.createOrderCheckoutSession({
            customerId,
            userId,
            orderIds: [order.id],
            lineItems: [
                {
                    name: kitName,
                    description: `Order ${order.orderNumber}`,
                    unitAmountCents: decimalToCents(order.total),
                    quantity: 1,
                },
            ],
        });

        return { url: checkout.url };
    }

    // ─── Admin: list all orders ─────────────────────────────────────────
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

    // ─── Admin: get single order ────────────────────────────────────────
    async getById(id: string) {
        const order = await this.prisma.order.findUnique({ where: { id }, include: adminOrderInclude });
        if (!order) throw new NotFoundException("Order not found");
        return order;
    }

    // ─── Admin: update order status ─────────────────────────────────────
    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { id: true, status: true, paymentStatus: true },
        });
        if (!order) throw new NotFoundException("Order not found");

        const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
        if (!allowed.includes(dto.status)) {
            throw new BadRequestException(
                `Cannot transition from ${order.status} to ${dto.status}. Allowed: ${allowed.join(", ") || "none"}`,
            );
        }

        // For shipping/delivering/completing — payment must be PAID (except cancellation)
        if (dto.status !== "CANCELLED" && order.paymentStatus !== ("PAID" as PaymentStatus)) {
            throw new BadRequestException("Cannot advance order status until payment is confirmed");
        }

        const now = new Date();
        const data: Prisma.OrderUpdateInput = {
            status: dto.status as OrderStatus,
        };

        switch (dto.status) {
            case "SHIPPED":
                data.shippedAt = now;
                if (dto.trackingNumber) data.trackingNumber = dto.trackingNumber;
                if (dto.trackingUrl) data.trackingUrl = dto.trackingUrl;
                break;
            case "DELIVERED":
                data.deliveredAt = now;
                break;
            case "COMPLETED":
                data.completedAt = now;
                break;
            case "CANCELLED":
                data.cancelledAt = now;
                break;
        }

        const updated = await this.prisma.order.update({
            where: { id },
            data,
            include: adminOrderInclude,
        });

        this.logger.log(`Order ${updated.orderNumber} transitioned to ${dto.status} by admin`);
        return updated;
    }

    // ─── Checkout: create orders from cart ───────────────────────────────
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

        // Find active subscription + available slots so we can apply the per-plan discount.
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" as SubscriptionStatus },
            include: {
                plan: { select: { kitDiscount: true, addOnDiscount: true } },
                holidaySlots: {
                    where: { status: "PENDING" as HolidaySlotStatus },
                    orderBy: { slotNumber: "asc" },
                    select: { id: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        const availableSlots = subscription?.holidaySlots ?? [];
        const kitDiscountPct = subscription ? new Prisma.Decimal(subscription.plan.kitDiscount).div(100) : ZERO;
        const addOnDiscountPct = subscription ? new Prisma.Decimal(subscription.plan.addOnDiscount).div(100) : ZERO;

        const shippingFee = subscription ? ZERO : SHIPPING_FEES[dto.deliveryOption];

        // Compute per-cart discounts up front so taxable subtotal reflects the discounted prices.
        type Priced = {
            rentalDiscount: Prisma.Decimal;
            addOnDiscount: Prisma.Decimal;
            taxableAfterDiscount: Prisma.Decimal;
            slotId: string | null;
        };
        const priced: Priced[] = carts.map((cart, idx) => {
            const slotId = idx < availableSlots.length ? availableSlots[idx].id : null;
            const rentalBase = cart.rentalFee.plus(cart.extendedFee);
            const rentalDiscount = slotId ? rentalBase.times(kitDiscountPct) : ZERO;
            const addOnDiscount = slotId ? cart.addOnsFee.times(addOnDiscountPct) : ZERO;
            const taxable = rentalBase.minus(rentalDiscount).plus(cart.addOnsFee.minus(addOnDiscount));
            return { rentalDiscount, addOnDiscount, taxableAfterDiscount: taxable, slotId };
        });

        const taxableSubtotal = priced.reduce((acc, p) => acc.plus(p.taxableAfterDiscount), ZERO);
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
                const p = priced[i];

                // Distribute tax/shipping across orders: first order takes any remainder so totals stay exact.
                const isLast = i === carts.length - 1;
                const orderTax = isLast ? carryoverTax : new Prisma.Decimal(0);
                const orderShipping = isLast ? carryoverShipping : new Prisma.Decimal(0);

                const cartSubtotal = cart.rentalFee
                    .plus(cart.extendedFee)
                    .minus(p.rentalDiscount)
                    .plus(cart.addOnsFee)
                    .minus(p.addOnDiscount)
                    .plus(cart.kitDeposit)
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
                        ...(p.slotId
                            ? {
                                  subscriptionId: subscription!.id,
                                  holidaySlotId: p.slotId,
                              }
                            : {}),
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
                        kitDiscount: p.rentalDiscount,
                        addOnDiscount: p.addOnDiscount,
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

                if (p.slotId) {
                    await tx.subscriptionHolidaySlot.update({
                        where: { id: p.slotId },
                        data: {
                            status: "SELECTED" as HolidaySlotStatus,
                            holidayId: cart.holidayId,
                        },
                    });
                }

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

    // ─── Stripe webhook: checkout completed ─────────────────────────────
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
