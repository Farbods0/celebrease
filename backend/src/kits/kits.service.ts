import { PrismaService } from "@/common/services/prisma.service";
import { CreateKitDto } from "@/kits/dto/create-kit.dto";
import { AddKitItemDto, AddKitPreviewItemDto, ReorderKitPreviewItemsDto } from "@/kits/dto/kit-item.dto";
import { UpdateKitDto } from "@/kits/dto/update-kit.dto";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const kitInclude = {
    holiday: { select: { id: true, name: true, category: true, image: true } },
    items: {
        select: {
            qty: true,
            item: { select: { id: true, sku: true, name: true, image: true, category: true, status: true } },
        },
    },
    previewItems: {
        orderBy: { sortOrder: "asc" as const },
        select: {
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
                images: dto.images ?? [],
            },
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
                ...(dto.images !== undefined && { images: dto.images }),
            },
        });
    }

    async remove(id: string) {
        const kit = await this.prisma.kit.findUnique({ where: { id }, select: { id: true } });
        if (!kit) throw new NotFoundException("Kit not found");
        return this.prisma.kit.delete({ where: { id } });
    }

    async addItem(kitId: string, dto: AddKitItemDto) {
        const kit = await this.prisma.kit.findUnique({ where: { id: kitId }, select: { id: true } });
        if (!kit) throw new NotFoundException("Kit not found");

        const item = await this.prisma.item.findUnique({ where: { id: dto.itemId }, select: { id: true } });
        if (!item) throw new NotFoundException("Inventory item not found");

        const exists = await this.prisma.kitItem.findUnique({
            where: { kitId_itemId: { kitId, itemId: dto.itemId } },
            select: { itemId: true },
        });
        if (exists) throw new ConflictException("This item is already in the kit");

        return this.prisma.kitItem.create({
            data: { kitId, itemId: dto.itemId, qty: dto.qty ?? 1 },
        });
    }

    async removeItem(kitId: string, itemId: string) {
        const kitItem = await this.prisma.kitItem.findUnique({
            where: { kitId_itemId: { kitId, itemId } },
            select: { itemId: true },
        });
        if (!kitItem) throw new NotFoundException("Kit item not found");

        return this.prisma.kitItem.delete({
            where: { kitId_itemId: { kitId, itemId } },
        });
    }

    async addPreviewItem(kitId: string, dto: AddKitPreviewItemDto) {
        const kit = await this.prisma.kit.findUnique({ where: { id: kitId }, select: { id: true } });
        if (!kit) throw new NotFoundException("Kit not found");

        const item = await this.prisma.item.findUnique({ where: { id: dto.itemId }, select: { id: true } });
        if (!item) throw new NotFoundException("Inventory item not found");

        const exists = await this.prisma.kitPreviewItem.findUnique({
            where: { kitId_itemId: { kitId, itemId: dto.itemId } },
            select: { itemId: true },
        });
        if (exists) throw new ConflictException("This item is already in the preview");

        const last = await this.prisma.kitPreviewItem.findFirst({
            where: { kitId },
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
        });

        return this.prisma.kitPreviewItem.create({
            data: { kitId, itemId: dto.itemId, sortOrder: (last?.sortOrder ?? -1) + 1 },
        });
    }

    async removePreviewItem(kitId: string, itemId: string) {
        const previewItem = await this.prisma.kitPreviewItem.findUnique({
            where: { kitId_itemId: { kitId, itemId } },
            select: { itemId: true },
        });
        if (!previewItem) throw new NotFoundException("Preview item not found");

        return this.prisma.kitPreviewItem.delete({
            where: { kitId_itemId: { kitId, itemId } },
        });
    }

    async reorderPreviewItems(kitId: string, dto: ReorderKitPreviewItemsDto) {
        const kit = await this.prisma.kit.findUnique({ where: { id: kitId }, select: { id: true } });
        if (!kit) throw new NotFoundException("Kit not found");

        const unique = new Set(dto.itemIds);
        if (unique.size !== dto.itemIds.length) {
            throw new BadRequestException("itemIds must not contain duplicates");
        }

        const existing = await this.prisma.kitPreviewItem.findMany({
            where: { kitId },
            select: { itemId: true },
        });

        if (existing.length !== dto.itemIds.length) {
            throw new BadRequestException("itemIds must contain every preview item exactly once");
        }

        const existingIds = new Set(existing.map((p) => p.itemId));
        for (const id of dto.itemIds) {
            if (!existingIds.has(id)) {
                throw new BadRequestException(`Item ${id} is not a preview item of this kit`);
            }
        }

        await this.prisma.$transaction(
            dto.itemIds.map((itemId, sortOrder) =>
                this.prisma.kitPreviewItem.update({
                    where: { kitId_itemId: { kitId, itemId } },
                    data: { sortOrder },
                }),
            ),
        );

        return this.getById(kitId);
    }
}
