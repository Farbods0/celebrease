import { PrismaService } from "@/common/services/prisma.service";
import { CreateKitDto } from "@/kits/dto/create-kit.dto";
import { UpdateKitDto } from "@/kits/dto/update-kit.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const kitInclude = {
    holiday: { select: { id: true, name: true, category: true, image: true } },
    items: {
        select: {
            id: true,
            qty: true,
            item: { select: { id: true, sku: true, name: true, image: true, category: true, status: true } },
        },
    },
    previewItems: {
        orderBy: { sortOrder: "asc" as const },
        select: {
            id: true,
            sortOrder: true,
            item: { select: { id: true, sku: true, name: true, image: true } },
        },
    },
} as const;

@Injectable()
export class KitsService {
    constructor(private readonly prisma: PrismaService) {}

    async list(holidayId?: string) {
        const items = await this.prisma.kit.findMany({
            where: {
                ...(holidayId ? { holidayId } : {}),
                status: { in: ["ACTIVE", "LOW_STOCK"] },
            },
            include: kitInclude,
            orderBy: [{ holidayId: "asc" }, { tier: "asc" }],
        });
        return { items };
    }

    async listAll(holidayId?: string) {
        const items = await this.prisma.kit.findMany({
            where: holidayId ? { holidayId } : undefined,
            include: kitInclude,
            orderBy: [{ holidayId: "asc" }, { tier: "asc" }],
        });
        return { items };
    }

    async getById(id: string) {
        const kit = await this.prisma.kit.findUnique({ where: { id }, include: kitInclude });
        if (!kit) throw new NotFoundException("Kit not found");
        return kit;
    }

    async create(dto: CreateKitDto) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id: dto.holidayId }, select: { id: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        const tierExists = await this.prisma.kit.findFirst({
            where: { holidayId: dto.holidayId, tier: dto.tier },
            select: { id: true },
        });
        if (tierExists) {
            throw new ConflictException(`A ${dto.tier.toLowerCase()} kit already exists for this holiday`);
        }

        const skuExists = await this.prisma.kit.findUnique({ where: { sku: dto.sku }, select: { id: true } });
        if (skuExists) throw new ConflictException(`A kit with SKU ${dto.sku} already exists`);

        return this.prisma.kit.create({
            data: {
                sku: dto.sku,
                tier: dto.tier,
                holidayId: dto.holidayId,
                status: dto.status ?? "DRAFT",
                price30Day: dto.price30Day,
                price60Day: dto.price60Day,
                deposit: dto.deposit,
                seasonStart: dto.seasonStart ? new Date(dto.seasonStart) : null,
                seasonEnd: dto.seasonEnd ? new Date(dto.seasonEnd) : null,
                alwaysVisible: dto.alwaysVisible ?? false,
                visibleOnPdp: dto.visibleOnPdp ?? true,
                addOnsEnabled: dto.addOnsEnabled ?? true,
                limitInventory: dto.limitInventory ?? false,
            },
            include: kitInclude,
        });
    }

    async update(id: string, dto: UpdateKitDto) {
        const kit = await this.prisma.kit.findUnique({ where: { id }, select: { id: true, holidayId: true, tier: true, sku: true } });
        if (!kit) throw new NotFoundException("Kit not found");

        if (dto.sku && dto.sku !== kit.sku) {
            const exists = await this.prisma.kit.findUnique({ where: { sku: dto.sku }, select: { id: true } });
            if (exists && exists.id !== id) throw new ConflictException(`A kit with SKU ${dto.sku} already exists`);
        }

        const nextHolidayId = dto.holidayId ?? kit.holidayId;
        const nextTier = dto.tier ?? kit.tier;
        if (nextHolidayId !== kit.holidayId || nextTier !== kit.tier) {
            const conflict = await this.prisma.kit.findFirst({
                where: { holidayId: nextHolidayId, tier: nextTier, id: { not: id } },
                select: { id: true },
            });
            if (conflict) {
                throw new ConflictException(`A ${nextTier.toLowerCase()} kit already exists for this holiday`);
            }
        }

        return this.prisma.kit.update({
            where: { id },
            data: {
                ...(dto.sku !== undefined && { sku: dto.sku }),
                ...(dto.tier !== undefined && { tier: dto.tier }),
                ...(dto.holidayId !== undefined && { holidayId: dto.holidayId }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.price30Day !== undefined && { price30Day: dto.price30Day }),
                ...(dto.price60Day !== undefined && { price60Day: dto.price60Day }),
                ...(dto.deposit !== undefined && { deposit: dto.deposit }),
                ...(dto.seasonStart !== undefined && { seasonStart: dto.seasonStart ? new Date(dto.seasonStart) : null }),
                ...(dto.seasonEnd !== undefined && { seasonEnd: dto.seasonEnd ? new Date(dto.seasonEnd) : null }),
                ...(dto.alwaysVisible !== undefined && { alwaysVisible: dto.alwaysVisible }),
                ...(dto.visibleOnPdp !== undefined && { visibleOnPdp: dto.visibleOnPdp }),
                ...(dto.addOnsEnabled !== undefined && { addOnsEnabled: dto.addOnsEnabled }),
                ...(dto.limitInventory !== undefined && { limitInventory: dto.limitInventory }),
            },
            include: kitInclude,
        });
    }

    async remove(id: string) {
        const kit = await this.prisma.kit.findUnique({ where: { id }, select: { id: true } });
        if (!kit) throw new NotFoundException("Kit not found");
        return this.prisma.kit.delete({ where: { id } });
    }
}
