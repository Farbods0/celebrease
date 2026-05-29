import { CreateAddOnDto } from "@/addons/dto/create-addon.dto";
import { UpdateAddOnDto } from "@/addons/dto/update-addon.dto";
import { PrismaService } from "@/common/services/prisma.service";
import { UploadService } from "@/upload/upload.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

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
            select: { id: true, sku: true, image: true, inventory: { select: { availableQty: true } } },
        });
        if (!existing) throw new NotFoundException("Add-on not found");

        if (dto.sku && dto.sku !== existing.sku) {
            const conflict = await this.prisma.addOn.findUnique({ where: { sku: dto.sku }, select: { id: true } });
            if (conflict && conflict.id !== id) {
                throw new ConflictException(`An add-on with SKU ${dto.sku} already exists`);
            }
        }

        const diffQty = dto?.totalQty && existing.inventory ? dto.totalQty - existing.inventory.availableQty : 0;

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
}
