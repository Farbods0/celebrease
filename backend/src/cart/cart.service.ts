import { PrismaService } from "@/common/services/prisma.service";
import { AddToCartDto } from "@/cart/dto/add-to-cart.dto";
import { Duration } from "@/generated/prisma/enums";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";

const cartInclude = {
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

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) {}

    async listMine(userId: string) {
        const items = await this.prisma.cart.findMany({
            where: { userId },
            include: cartInclude,
            orderBy: { createdAt: "desc" },
        });
        return { items };
    }

    async addToCart(userId: string, dto: AddToCartDto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            throw new BadRequestException("Invalid start or end date");
        }
        if (endDate <= startDate) {
            throw new BadRequestException("End date must be after start date");
        }

        const kit = await this.prisma.kit.findUnique({
            where: { id: dto.kitId },
            include: { items: { select: { itemId: true, qty: true } } },
        });
        if (!kit) throw new NotFoundException("Kit not found");
        if (kit.holidayId !== dto.holidayId) {
            throw new BadRequestException("Kit does not belong to the selected holiday");
        }

        const requestedAddOns = dto.addOns ?? [];
        const addOnRecords = requestedAddOns.length
            ? await this.prisma.addOn.findMany({
                  where: { id: { in: requestedAddOns.map((a) => a.addOnId) } },
                  select: { id: true, price: true, deposit: true, isActive: true },
              })
            : [];

        if (addOnRecords.length !== requestedAddOns.length) {
            throw new NotFoundException("One or more add-ons not found");
        }
        const inactive = addOnRecords.find((a) => !a.isActive);
        if (inactive) throw new BadRequestException("One or more add-ons are not available");

        const addOnById = new Map(addOnRecords.map((a) => [a.id, a]));

        const rentalFee = new Prisma.Decimal(kit.price30Day);
        const extendedFee =
            dto.duration === Duration.SIXTY_DAY
                ? Prisma.Decimal.max(new Prisma.Decimal(0), new Prisma.Decimal(kit.price60Day).minus(kit.price30Day))
                : new Prisma.Decimal(0);
        const kitDeposit = new Prisma.Decimal(kit.deposit);

        let addOnsFee = new Prisma.Decimal(0);
        let addOnDeposit = new Prisma.Decimal(0);
        const cartAddOnRows = requestedAddOns.map((req) => {
            const a = addOnById.get(req.addOnId)!;
            const qty = req.qty ?? 1;
            const linePrice = new Prisma.Decimal(a.price).times(qty);
            const lineDeposit = new Prisma.Decimal(a.deposit).times(qty);
            addOnsFee = addOnsFee.plus(linePrice);
            addOnDeposit = addOnDeposit.plus(lineDeposit);
            return {
                addOnId: a.id,
                qty,
                price: new Prisma.Decimal(a.price),
                deposit: new Prisma.Decimal(a.deposit),
            };
        });

        const total = rentalFee.plus(extendedFee).plus(kitDeposit).plus(addOnsFee).plus(addOnDeposit);

        const cart = await this.prisma.cart.create({
            data: {
                userId,
                kitId: kit.id,
                holidayId: dto.holidayId,
                duration: dto.duration,
                startDate,
                endDate,
                rentalFee,
                extendedFee,
                kitDeposit,
                addOnsFee,
                addOnDeposit,
                total,
                items: {
                    create: kit.items.map((ki) => ({ itemId: ki.itemId, qty: ki.qty })),
                },
                addOns: cartAddOnRows.length ? { create: cartAddOnRows } : undefined,
            },
            include: cartInclude,
        });

        return cart;
    }

    async remove(userId: string, cartId: string) {
        const cart = await this.prisma.cart.findUnique({ where: { id: cartId }, select: { id: true, userId: true } });
        if (!cart) throw new NotFoundException("Cart not found");
        if (cart.userId !== userId) throw new ForbiddenException("Not your cart");

        await this.prisma.cart.delete({ where: { id: cartId } });
        return { ok: true };
    }
}
