import { PrismaService } from "@/common/services/prisma.service";
import { CreateItemDto } from "@/inventory/dto/create-item.dto";
import { UpdateItemDto } from "@/inventory/dto/update-item.dto";
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

@Injectable()
export class InventoryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async list() {
        const items = await this.prisma.item.findMany({
            where: { status: { in: ["ACTIVE", "LOW_STOCK"] } },
            include: itemInclude,
            orderBy: { createdAt: "desc" },
        });
        return { items };
    }

    async listAll() {
        const items = await this.prisma.item.findMany({
            include: itemInclude,
            orderBy: { createdAt: "desc" },
        });
        return { items };
    }

    async getById(id: string) {
        const item = await this.prisma.item.findUnique({ where: { id }, include: itemInclude });
        if (!item) throw new NotFoundException("Inventory item not found");

        return item;
    }

    async create(dto: CreateItemDto) {
        const skuExists = await this.prisma.item.findUnique({ where: { sku: dto.sku }, select: { id: true } });
        if (skuExists) throw new ConflictException(`An inventory item with SKU ${dto.sku} already exists`);

        return this.prisma.item.create({
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
                ...(dto.kits?.length
                    ? {
                          kitItems: {
                              createMany: {
                                  data: dto.kits.map(({ kitId, qty }) => ({ kitId, qty })),
                              },
                          },
                      }
                    : {}),
            },
        });
    }

    async update(id: string, dto: UpdateItemDto) {
        const existing = await this.prisma.item.findUnique({ where: { id }, select: { id: true, sku: true, image: true } });
        if (!existing) throw new NotFoundException("Inventory item not found");

        if (dto.sku && dto.sku !== existing.sku) {
            const conflict = await this.prisma.item.findUnique({ where: { sku: dto.sku }, select: { id: true } });
            if (conflict && conflict.id !== id) {
                throw new ConflictException(`An inventory item with SKU ${dto.sku} already exists`);
            }
        }

        const updated = await this.prisma.$transaction(async (tx) => {
            if (dto.kits !== undefined) {
                await tx.kitItem.deleteMany({ where: { itemId: id } });
                if (dto.kits.length) {
                    await tx.kitItem.createMany({
                        data: dto.kits.map(({ kitId, qty }) => ({ itemId: id, kitId, qty })),
                    });
                }
            }

            return tx.item.update({
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
            });
        });

        return updated;
    }

    async remove(id: string) {
        const item = await this.prisma.item.findUnique({ where: { id }, select: { id: true, image: true } });
        if (!item) throw new NotFoundException("Inventory item not found");

        const deleted = await this.prisma.item.delete({ where: { id } });
        if (item.image) {
            await this.uploadService.deleteImage(item.image).catch(() => undefined);
        }
        return deleted;
    }
}
