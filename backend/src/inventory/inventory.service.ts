import { PrismaService } from "@/common/services/prisma.service";
import { InventoryUnitStatus } from "@/generated/prisma/enums";
import { CreateInventoryItemDto } from "@/inventory/dto/create-inventory-item.dto";
import { UpdateInventoryItemDto } from "@/inventory/dto/update-inventory-item.dto";
import { UploadService } from "@/upload/upload.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const itemInclude = {
    kitItems: {
        select: {
            id: true,
            qty: true,
            kit: {
                select: {
                    id: true,
                    sku: true,
                    tier: true,
                    holidayId: true,
                    holiday: { select: { id: true, name: true } },
                },
            },
        },
    },
} as const;

const UNIT_STATUS_TO_FIELD: Record<InventoryUnitStatus, string> = {
    AVAILABLE: "available",
    RESERVED: "reserved",
    SHIPPED: "shipped",
    IN_CLEANING: "cleaning",
    IN_REPAIR: "repair",
    RETIRED: "retired",
    LOST: "lost",
};

const emptyCounts = () => ({
    available: 0,
    reserved: 0,
    shipped: 0,
    cleaning: 0,
    repair: 0,
    retired: 0,
    lost: 0,
});

@Injectable()
export class InventoryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    private async unitCountsByItem(itemIds: string[]) {
        const byItem = new Map<string, ReturnType<typeof emptyCounts>>();
        for (const id of itemIds) byItem.set(id, emptyCounts());
        if (!itemIds.length) return byItem;
        const groups = await this.prisma.inventoryUnit.groupBy({
            by: ["itemId", "status"],
            where: { itemId: { in: itemIds } },
            _count: { _all: true },
        });
        for (const g of groups) {
            const counts = byItem.get(g.itemId);
            if (!counts) continue;
            const field = UNIT_STATUS_TO_FIELD[g.status] as keyof ReturnType<typeof emptyCounts>;
            counts[field] = g._count._all;
        }
        return byItem;
    }

    private attachUnitCounts<T extends { id: string; totalQty: number }>(items: T[], byItem: Map<string, ReturnType<typeof emptyCounts>>) {
        return items.map((item) => {
            const counts = byItem.get(item.id) ?? emptyCounts();
            const totalUnits = Object.values(counts).reduce((a, b) => a + b, 0);
            const available = totalUnits === 0 ? item.totalQty : counts.available;
            return { ...item, units: { ...counts, available, totalUnits } };
        });
    }

    async list() {
        const items = await this.prisma.inventoryItem.findMany({
            where: { status: { in: ["ACTIVE", "LOW_STOCK"] } },
            include: itemInclude,
            orderBy: { createdAt: "desc" },
        });
        const byItem = await this.unitCountsByItem(items.map((i) => i.id));
        return { items: this.attachUnitCounts(items, byItem) };
    }

    async listAll() {
        const items = await this.prisma.inventoryItem.findMany({
            include: itemInclude,
            orderBy: { createdAt: "desc" },
        });
        const byItem = await this.unitCountsByItem(items.map((i) => i.id));
        return { items: this.attachUnitCounts(items, byItem) };
    }

    async getById(id: string) {
        const item = await this.prisma.inventoryItem.findUnique({ where: { id }, include: itemInclude });
        if (!item) throw new NotFoundException("Inventory item not found");
        const byItem = await this.unitCountsByItem([id]);
        return this.attachUnitCounts([item], byItem)[0];
    }

    private async assertKitsExist(kitIds: string[]) {
        if (!kitIds.length) return;
        const found = await this.prisma.kit.findMany({
            where: { id: { in: kitIds } },
            select: { id: true },
        });
        if (found.length !== kitIds.length) {
            const foundIds = new Set(found.map((k) => k.id));
            const missing = kitIds.filter((id) => !foundIds.has(id));
            throw new NotFoundException(`Kits not found: ${missing.join(", ")}`);
        }
    }

    async create(dto: CreateInventoryItemDto) {
        const skuExists = await this.prisma.inventoryItem.findUnique({ where: { sku: dto.sku }, select: { id: true } });
        if (skuExists) throw new ConflictException(`An inventory item with SKU ${dto.sku} already exists`);

        const kitMappings = dto.kits ?? [];
        await this.assertKitsExist(kitMappings.map((k) => k.kitId));

        return this.prisma.inventoryItem.create({
            data: {
                sku: dto.sku,
                name: dto.name,
                image: dto.image,
                description: dto.description,
                category: dto.category,
                vendorName: dto.vendorName,
                vendorEmail: dto.vendorEmail,
                vendorPhone: dto.vendorPhone,
                costPerUnit: dto.costPerUnit,
                totalQty: dto.totalQty,
                lowStockThreshold: dto.lowStockThreshold ?? 0,
                initialStatus: dto.initialStatus ?? dto.status ?? "ACTIVE",
                status: dto.status ?? "ACTIVE",
                kitItems: kitMappings.length
                    ? { create: kitMappings.map((m) => ({ kitId: m.kitId, qty: m.qty })) }
                    : undefined,
            },
            include: itemInclude,
        });
    }

    async update(id: string, dto: UpdateInventoryItemDto) {
        const existing = await this.prisma.inventoryItem.findUnique({ where: { id }, select: { id: true, sku: true, image: true } });
        if (!existing) throw new NotFoundException("Inventory item not found");

        if (dto.sku && dto.sku !== existing.sku) {
            const conflict = await this.prisma.inventoryItem.findUnique({ where: { sku: dto.sku }, select: { id: true } });
            if (conflict && conflict.id !== id) {
                throw new ConflictException(`An inventory item with SKU ${dto.sku} already exists`);
            }
        }

        if (dto.kits) {
            await this.assertKitsExist(dto.kits.map((k) => k.kitId));
        }

        const oldImage = existing.image;
        const imageChanged = dto.image !== undefined && dto.image !== oldImage;

        const updated = await this.prisma.$transaction(async (tx) => {
            if (dto.kits !== undefined) {
                await tx.kitItem.deleteMany({ where: { itemId: id } });
                if (dto.kits.length) {
                    await tx.kitItem.createMany({
                        data: dto.kits.map((m) => ({ itemId: id, kitId: m.kitId, qty: m.qty })),
                    });
                }
            }
            return tx.inventoryItem.update({
                where: { id },
                data: {
                    ...(dto.sku !== undefined && { sku: dto.sku }),
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.image !== undefined && { image: dto.image }),
                    ...(dto.description !== undefined && { description: dto.description }),
                    ...(dto.category !== undefined && { category: dto.category }),
                    ...(dto.vendorName !== undefined && { vendorName: dto.vendorName }),
                    ...(dto.vendorEmail !== undefined && { vendorEmail: dto.vendorEmail }),
                    ...(dto.vendorPhone !== undefined && { vendorPhone: dto.vendorPhone }),
                    ...(dto.costPerUnit !== undefined && { costPerUnit: dto.costPerUnit }),
                    ...(dto.totalQty !== undefined && { totalQty: dto.totalQty }),
                    ...(dto.lowStockThreshold !== undefined && { lowStockThreshold: dto.lowStockThreshold }),
                    ...(dto.status !== undefined && { status: dto.status }),
                },
                include: itemInclude,
            });
        });

        if (imageChanged && oldImage) {
            await this.uploadService.deleteImage(oldImage).catch(() => undefined);
        }
        return updated;
    }

    async remove(id: string) {
        const item = await this.prisma.inventoryItem.findUnique({ where: { id }, select: { id: true, image: true } });
        if (!item) throw new NotFoundException("Inventory item not found");

        const deleted = await this.prisma.inventoryItem.delete({ where: { id } });
        if (item.image) {
            await this.uploadService.deleteImage(item.image).catch(() => undefined);
        }
        return deleted;
    }
}
