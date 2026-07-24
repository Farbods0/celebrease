import { PrismaService } from "@/common/services/prisma.service";
import { Prisma } from "@/generated/prisma/client";
import { HolidaySlotStatus, OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { InventoryAllocationService } from "@/inventory/inventory-allocation.service";
import { CreateCheckoutDto, DeliveryOption } from "@/orders/dto/create-checkout.dto";
import { InspectReturnDto } from "@/orders/dto/inspect-return.dto";
import { ListOrdersDto } from "@/orders/dto/list-orders.dto";
import { SetReturnLabelDto } from "@/orders/dto/set-return-label.dto";
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
    returnLines: {
        select: {
            id: true,
            itemId: true,
            addOnId: true,
            qty: true,
            condition: true,
            feeCharged: true,
            notes: true,
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
 *   PENDING           → RESERVED | CANCELLED
 *   RESERVED          → SHIPPED  | CANCELLED
 *   SHIPPED           → DELIVERED | CANCELLED
 *   DELIVERED         → RETURN_REQUESTED | COMPLETED
 *   RETURN_REQUESTED  → RETURN_IN_TRANSIT
 *   RETURN_IN_TRANSIT → RETURN_RECEIVED
 *   RETURN_RECEIVED   → INSPECTED (via /inspect)
 *   INSPECTED         → COMPLETED
 */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["RESERVED", "CANCELLED"],
    RESERVED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["RETURN_REQUESTED", "COMPLETED"],
    RETURN_REQUESTED: ["RETURN_IN_TRANSIT"],
    RETURN_IN_TRANSIT: ["RETURN_RECEIVED"],
    INSPECTED: ["COMPLETED"],
};

const ACTIVE_STATUSES: OrderStatus[] = [
    "PENDING",
    "RESERVED",
    "SHIPPED",
    "DELIVERED",
    "RETURN_REQUESTED",
    "RETURN_IN_TRANSIT",
    "RETURN_RECEIVED",
    "INSPECTED",
] as OrderStatus[];

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly stripe: StripeService,
        private readonly allocator: InventoryAllocationService,
    ) {}

    // ─── User: list my orders ───────────────────────────────────────────
    async listMine(userId: string, query: ListOrdersDto) {
        const { page, limit, filter } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = { userId };
        if (filter === "active") {
            where.status = { in: ACTIVE_STATUSES };
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

        return this.prisma.$transaction(async (tx) => {
            // Order was reserved at checkout — release the held stock back to available.
            await this.allocator.releaseForOrder(tx, id);
            return tx.order.update({
                where: { id },
                data: {
                    status: "CANCELLED",
                    cancelledAt: new Date(),
                },
                include: orderInclude,
            });
        });
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
        const { page, limit, search, filter } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = {};
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: "insensitive" } },
                { user: { email: { contains: search, mode: "insensitive" } } },
                { user: { name: { contains: search, mode: "insensitive" } } },
            ];
        }
        if (filter === "returns") {
            where.status = {
                in: ["RETURN_REQUESTED", "RETURN_IN_TRANSIT", "RETURN_RECEIVED", "INSPECTED"],
            };
        }

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
            select: { id: true, status: true, paymentStatus: true, holidaySlotId: true, subscriptionId: true },
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
            status: dto.status,
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
            case "RETURN_IN_TRANSIT":
                data.returnShippedAt = now;
                break;
            case "RETURN_RECEIVED":
                data.returnReceivedAt = now;
                break;
            case "COMPLETED":
                data.completedAt = now;
                break;
            case "CANCELLED":
                data.cancelledAt = now;
                break;
        }

        const updated = await this.prisma.$transaction(async (tx) => {
            // SHIPPED → reserved → shipped buckets.
            if (dto.status === "SHIPPED") {
                await this.allocator.markShippedForOrder(tx, id);
            }

            // CANCELLED → release whichever bucket the stock currently sits in.
            if (dto.status === "CANCELLED") {
                if (order.status === ("SHIPPED" as OrderStatus) || order.status === ("DELIVERED" as OrderStatus)) {
                    await this.allocator.releaseShippedForOrder(tx, id);
                } else {
                    await this.allocator.releaseForOrder(tx, id);
                }
            }

            const result = await tx.order.update({ where: { id }, data, include: adminOrderInclude });

            // SHIPPED → propagate to slot + subscription stage.
            if (dto.status === "SHIPPED" && order.holidaySlotId) {
                await tx.subscriptionHolidaySlot.update({
                    where: { id: order.holidaySlotId },
                    data: { status: "SHIPPED" },
                });
                if (order.subscriptionId) {
                    await tx.subscription.update({
                        where: { id: order.subscriptionId },
                        data: { stage: "IN_USE" },
                    });
                }
            }

            return result;
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
            where: { userId, status: "ACTIVE" },
            include: {
                plan: { select: { kitDiscount: true, addOnDiscount: true } },
                holidaySlots: {
                    where: { status: "PENDING" },
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
                        status: "PENDING",
                        paymentStatus: "PENDING",
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
                            status: "SELECTED",
                            holidayId: cart.holidayId,
                        },
                    });
                }

                // Reserve inventory for this order. Throws if stock is insufficient,
                // which rolls back the entire $transaction (no orphan orders).
                await this.allocator.reserveForOrder(tx, order.id);

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
            } catch (error) {
                this.logger.warn(`Failed to retrieve PaymentIntent ${paymentIntentId}: ${(error as Error).message}`);
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
                        paymentStatus: "PAID",
                        paidAt: now,
                        stripePaymentIntentId: i === 0 ? (paymentIntentId ?? null) : null,
                        stripeChargeId: chargeId,
                    },
                });
            }
        });

        this.logger.log(`Finalized ${orderIds.length} order(s) from session ${session.id}`);
    }

    // ─── User: request a return on a delivered order ────────────────────
    async requestReturn(userId: string, id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { id: true, userId: true, status: true },
        });
        if (!order) throw new NotFoundException("Order not found");
        if (order.userId !== userId) throw new ForbiddenException("Not your order");
        if (order.status !== ("DELIVERED" as OrderStatus)) {
            throw new BadRequestException("Only delivered orders can be returned");
        }

        // TODO: integrate Shippo/EasyPost to auto-generate a return label here.
        // For now the admin attaches the label via /admin/:id/return-label.

        return this.prisma.order.update({
            where: { id },
            data: {
                status: "RETURN_REQUESTED",
                returnRequestedAt: new Date(),
            },
            include: orderInclude,
        });
    }

    // ─── Admin: attach a return label / mark in transit ─────────────────
    async setReturnLabel(id: string, dto: SetReturnLabelDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { id: true, status: true },
        });
        if (!order) throw new NotFoundException("Order not found");
        if (order.status !== ("RETURN_REQUESTED" as OrderStatus) && order.status !== ("RETURN_IN_TRANSIT" as OrderStatus)) {
            throw new BadRequestException("Order is not in a return-requested state");
        }

        if (dto.returnLabelUrl === undefined && dto.returnTrackingNumber === undefined && dto.returnTrackingUrl === undefined) {
            throw new BadRequestException("At least one of returnLabelUrl, returnTrackingNumber, or returnTrackingUrl is required");
        }

        return this.prisma.order.update({
            where: { id },
            data: {
                ...(dto.returnLabelUrl !== undefined ? { returnLabelUrl: dto.returnLabelUrl } : {}),
                ...(dto.returnTrackingNumber !== undefined ? { returnTrackingNumber: dto.returnTrackingNumber } : {}),
                ...(dto.returnTrackingUrl !== undefined ? { returnTrackingUrl: dto.returnTrackingUrl } : {}),
            },
            include: adminOrderInclude,
        });
    }

    // ─── Admin: submit return inspection ────────────────────────────────
    // Computes refund vs forfeiture, issues a Stripe partial refund, transitions
    // inventory buckets, marks the order INSPECTED, and flips the subscription
    // slot to RETURNED. All side effects run in one DB transaction; the Stripe
    // refund is issued AFTER the DB succeeds, then its id is written back.
    async inspectReturn(id: string, dto: InspectReturnDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { select: { itemId: true, qty: true, item: { select: { id: true } } } },
                addOns: { select: { addOnId: true, qty: true, deposit: true } },
            },
        });
        if (!order) throw new NotFoundException("Order not found");
        if (order.status !== ("RETURN_RECEIVED" as OrderStatus)) {
            throw new BadRequestException("Order must be RETURN_RECEIVED before it can be inspected");
        }
        if (!order.stripeChargeId) {
            throw new BadRequestException("Order has no charge to refund against");
        }

        // Validate that the submitted lines fully account for every shipped unit.
        // Build the canonical "expected" map from the order, then walk dto.lines
        // accumulating per-target qtys. Each total must match exactly — no missing
        // coverage (would strand shippedQty), no over-coverage (would oversell into
        // negatives), no foreign references.
        const expected = new Map<string, number>();
        for (const l of order.items) expected.set(`i:${l.itemId}`, l.qty);
        for (const l of order.addOns) expected.set(`a:${l.addOnId}`, l.qty);

        const submitted = new Map<string, number>();
        for (const line of dto.lines) {
            if (!line.itemId === !line.addOnId) {
                throw new BadRequestException("Each return line must specify exactly one of itemId or addOnId");
            }
            if (line.qty <= 0) {
                throw new BadRequestException("Return line qty must be positive");
            }
            const key = line.itemId ? `i:${line.itemId}` : `a:${line.addOnId}`;
            if (!expected.has(key)) {
                throw new BadRequestException(`${line.itemId ?? line.addOnId} is not on this order`);
            }
            submitted.set(key, (submitted.get(key) ?? 0) + line.qty);
        }

        for (const [key, expectedQty] of expected) {
            const submittedQty = submitted.get(key) ?? 0;
            if (submittedQty !== expectedQty) {
                const id = key.slice(2);
                throw new BadRequestException(
                    `Return coverage mismatch for ${id}: expected ${expectedQty}, got ${submittedQty}. ` +
                        `Mark un-returned units as MISSING or LOST.`,
                );
            }
        }

        const totalDeposit = new Prisma.Decimal(order.kitDeposit).plus(order.addOnDeposit);
        const totalFees = dto.lines.reduce((acc, l) => acc.plus(new Prisma.Decimal(l.feeCharged ?? 0)), new Prisma.Decimal(0));
        // Forfeit cannot exceed deposit held; anything beyond is a write-off.
        const forfeit = Prisma.Decimal.min(totalFees, totalDeposit);
        const refund = totalDeposit.minus(forfeit);

        const refundCents = decimalToCents(refund);
        const now = new Date();

        // ── Stage 1: DB transaction — write inspection, transition inventory & slot.
        const updated = await this.prisma.$transaction(async (tx) => {
            // Re-submission support: undo any previously-applied inventory effects
            // before overwriting the return lines and applying the new ones.
            const prior = await tx.orderReturnLine.findMany({
                where: { orderId: id },
                select: { itemId: true, addOnId: true, qty: true, condition: true },
            });
            if (prior.length) {
                await this.allocator.undoInspection(tx, prior);
            }

            await tx.orderReturnLine.deleteMany({ where: { orderId: id } });
            await tx.orderReturnLine.createMany({
                data: dto.lines.map((l) => ({
                    orderId: id,
                    itemId: l.itemId ?? null,
                    addOnId: l.addOnId ?? null,
                    qty: l.qty,
                    condition: l.condition,
                    feeCharged: new Prisma.Decimal(l.feeCharged ?? 0),
                    notes: l.notes ?? null,
                })),
            });

            await this.allocator.applyInspection(
                tx,
                dto.lines.map((l) => ({
                    itemId: l.itemId ?? null,
                    addOnId: l.addOnId ?? null,
                    qty: l.qty,
                    condition: l.condition,
                })),
            );

            const order = await tx.order.update({
                where: { id },
                data: {
                    status: "INSPECTED",
                    inspectedAt: now,
                    inspectionNotes: dto.inspectionNotes ?? null,
                    depositRefunded: refund,
                    depositForfeited: forfeit,
                },
                include: adminOrderInclude,
            });

            if (order.holidaySlotId) {
                await tx.subscriptionHolidaySlot.update({
                    where: { id: order.holidaySlotId },
                    data: { status: "RETURNED" },
                });
            }

            // Roll the parent subscription's stage forward. If every slot is now
            // RETURNED or SKIPPED, the subscription has finished its cycle; otherwise
            // we drop back to RETURNED so the user can pick the next holiday.
            if (order.subscriptionId) {
                const slots = await tx.subscriptionHolidaySlot.findMany({
                    where: { subscriptionId: order.subscriptionId },
                    select: { status: true },
                });
                const allDone = slots.every(
                    (s) => s.status === ("RETURNED" as HolidaySlotStatus) || s.status === ("SKIPPED" as HolidaySlotStatus),
                );
                await tx.subscription.update({
                    where: { id: order.subscriptionId },
                    data: { stage: allDone ? "COMPLETED" : "RETURNED" },
                });
            }

            return order;
        });

        // ── Stage 2: Stripe refund (only if there's something to refund).
        if (refundCents > 0) {
            try {
                const refundObj = await this.stripe.client.refunds.create({
                    charge: order.stripeChargeId,
                    amount: refundCents,
                    metadata: { orderId: id, kind: "deposit_refund" },
                });
                await this.prisma.order.update({
                    where: { id },
                    data: { stripeRefundId: refundObj.id },
                });
                this.logger.log(`Refunded ${refundCents}¢ for order ${order.orderNumber} (${refundObj.id})`);
            } catch (error) {
                // DB has already recorded the inspection; surface the failure so the admin can retry.
                this.logger.error(`Stripe refund failed for order ${order.orderNumber}: ${(error as Error).message}`);
                throw new BadRequestException(`Inspection saved but Stripe refund failed: ${(error as Error).message}`);
            }
        }

        return updated;
    }

    // ─── Admin: finalize inspected order to COMPLETED ────────────────────
    async completeInspected(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { id: true, status: true, holidaySlotId: true },
        });
        if (!order) throw new NotFoundException("Order not found");
        if (order.status !== ("INSPECTED" as OrderStatus)) {
            throw new BadRequestException("Order must be INSPECTED before completion");
        }

        return this.prisma.order.update({
            where: { id },
            data: { status: "COMPLETED", completedAt: new Date() },
            include: adminOrderInclude,
        });
    }
}
