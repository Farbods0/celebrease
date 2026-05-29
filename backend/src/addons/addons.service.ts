import { CreateAddOnDto } from "@/addons/dto/create-addon.dto";
import { UpdateAddOnDto } from "@/addons/dto/update-addon.dto";
import { PrismaService } from "@/common/services/prisma.service";
import { AdjustStockDto } from "@/inventory/dto/adjust-stock.dto";
import { UploadService } from "@/upload/upload.service";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const addonInclude = {
    holidays: {
        select: {
            holiday: {
                select: { id: true, name: true },
            },
        },
    },
    inventory: {
        select: {
            totalQty: true,
            availableQty: true,
            reservedQty: true,
            shippedQty: true,
            cleaningQty: true,
            repairQty: true,
            lostQty: true,
        },
    },
};

@Injectable()
export class AddOnsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async list() {
        const items = await this.prisma.addOn.findMany({
            where: { isActive: true },
            include: addonInclude,
            orderBy: { createdAt: "desc" },
        });
        return { items };
    }

    async listAll() {
        const items = await this.prisma.addOn.findMany({
            include: addonInclude,
            orderBy: { createdAt: "desc" },
        });
        return { items };
    }

    async getById(id: string) {
        const addon = await this.prisma.addOn.findUnique({ where: { id }, include: addonInclude });
        if (!addon) throw new NotFoundException("Add-on not found");
        return addon;
    }

    async create(dto: CreateAddOnDto) {
        if (dto.sku) {
            const exists = await this.prisma.addOn.findUnique({ where: { sku: dto.sku }, select: { id: true } });
            if (exists) throw new ConflictException(`An add-on with SKU ${dto.sku} already exists`);
        }

        const created = await this.prisma.addOn.create({
            data: {
                sku: dto.sku,
                name: dto.name,
                image: dto.image,
                description: dto.description,
                price: dto.price,
                deposit: dto.deposit ?? 0,
                isActive: dto.isActive,
                ...(dto.holidayIds?.length
                    ? {
                          holidays: {
                              createMany: {
                                  data: dto.holidayIds.map((holidayId) => ({ holidayId })),
                              },
                          },
                      }
                    : {}),
                inventory: {
                    create: {
                        totalQty: dto.totalQty,
                        availableQty: dto.totalQty,
                    },
                },
            },
        });
        return created;
    }

    async update(id: string, dto: UpdateAddOnDto) {
        const existing = await this.prisma.addOn.findUnique({
            where: { id },
            select: { id: true, sku: true, image: true, inventory: { select: { totalQty: true } } },
        });
        if (!existing) throw new NotFoundException("Add-on not found");

        if (dto.sku && dto.sku !== existing.sku) {
            const conflict = await this.prisma.addOn.findUnique({ where: { sku: dto.sku }, select: { id: true } });
            if (conflict && conflict.id !== id) {
                throw new ConflictException(`An add-on with SKU ${dto.sku} already exists`);
            }
        }

        const diffQty =
            dto?.totalQty !== undefined && existing.inventory ? dto.totalQty - existing.inventory.totalQty : 0;

        const updated = await this.prisma.$transaction(async (tx) => {
            if (dto.holidayIds !== undefined) {
                await tx.addOnHoliday.deleteMany({ where: { addOnId: id } });
                if (dto.holidayIds.length) {
                    await tx.addOnHoliday.createMany({
                        data: dto.holidayIds.map((holidayId) => ({ addOnId: id, holidayId })),
                    });
                }
            }

            return tx.addOn.update({
                where: { id },
                data: {
                    ...(dto.sku !== undefined && { sku: dto.sku }),
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.image !== undefined && { image: dto.image }),
                    ...(dto.description !== undefined && { description: dto.description }),
                    ...(dto.price !== undefined && { price: dto.price }),
                    ...(dto.deposit !== undefined && { deposit: dto.deposit }),
                    ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                    ...(diffQty !== 0
                        ? {
                              inventory: {
                                  update: {
                                      totalQty: { increment: diffQty },
                                      availableQty: { increment: diffQty },
                                  },
                              },
                          }
                        : {}),
                },
            });
        });

        return updated;
    }

    async remove(id: string) {
        const addon = await this.prisma.addOn.findUnique({ where: { id }, select: { id: true, image: true } });
        if (!addon) throw new NotFoundException("Add-on not found");
        const deleted = await this.prisma.addOn.delete({ where: { id } });
        if (addon.image) {
            await this.uploadService.deleteImage(addon.image).catch(() => undefined);
        }
        return deleted;
    }

    async adjustStock(id: string, dto: AdjustStockDto) {
        const addon = await this.prisma.addOn.findUnique({
            where: { id },
            select: {
                id: true,
                inventory: {
                    select: {
                        totalQty: true,
                        availableQty: true,
                        reservedQty: true,
                        shippedQty: true,
                        cleaningQty: true,
                        repairQty: true,
                        lostQty: true,
                    },
                },
            },
        });
        if (!addon) throw new NotFoundException("Add-on not found");
        if (!addon.inventory) throw new BadRequestException("Add-on has no inventory record");

        const inv = addon.inventory;
        const next = {
            totalQty: inv.totalQty + (dto.totalDelta ?? 0),
            availableQty: inv.availableQty + (dto.availableDelta ?? 0),
            reservedQty: inv.reservedQty + (dto.reservedDelta ?? 0),
            shippedQty: inv.shippedQty + (dto.shippedDelta ?? 0),
            cleaningQty: inv.cleaningQty + (dto.cleaningDelta ?? 0),
            repairQty: inv.repairQty + (dto.repairDelta ?? 0),
            lostQty: inv.lostQty + (dto.lostDelta ?? 0),
        };

        for (const [k, v] of Object.entries(next)) {
            if (v < 0) throw new BadRequestException(`${k} cannot be negative (would become ${v})`);
        }

        const bucketSum = next.availableQty + next.reservedQty + next.shippedQty + next.cleaningQty + next.repairQty + next.lostQty;
        if (bucketSum > next.totalQty) {
            throw new BadRequestException(
                `Stock buckets (${bucketSum}) exceed total (${next.totalQty}). Adjust totalDelta to compensate.`,
            );
        }

        await this.prisma.inventory.update({
            where: { addOnId: id },
            data: next,
        });

        return this.getById(id);
    }
}
