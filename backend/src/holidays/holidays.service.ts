import { PrismaService } from "@/common/services/prisma.service";
import { CreateHolidayDto } from "@/holidays/dto/create-holiday.dto";
import { UpdateHolidayDto } from "@/holidays/dto/update-holiday.dto";
import { UploadService } from "@/upload/upload.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const holidayInclude = {
    kits: {
        select: {
            id: true,
            sku: true,
            tier: true,
            status: true,
            price30Day: true,
            price60Day: true,
            deposit: true,
        },
    },
    addOns: {
        select: {
            addOn: {
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    image: true,
                    price: true,
                    deposit: true,
                    inventory: true,
                    status: true,
                },
            },
        },
    },
};

@Injectable()
export class HolidaysService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async list() {
        const items = await this.prisma.holiday.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: holidayInclude,
        });
        return { items };
    }

    async listAll() {
        const items = await this.prisma.holiday.findMany({
            orderBy: { sortOrder: "asc" },
            include: holidayInclude,
        });
        return { items };
    }

    async getById(id: string) {
        const holiday = await this.prisma.holiday.findUnique({
            where: { id },
            include: {
                kits: {
                    select: {
                        ...holidayInclude.kits.select,
                        items: {
                            select: {
                                qty: true,
                                item: {
                                    select: {
                                        id: true,
                                        sku: true,
                                        name: true,
                                        image: true,
                                        category: true,
                                        status: true,
                                    },
                                },
                            },
                        },
                    },
                },
                addOns: holidayInclude.addOns,
            },
        });
        if (!holiday) throw new NotFoundException("Holiday not found");

        const holidays = await this.prisma.holiday.findMany({
            where: {
                isActive: true,
                id: { not: id },
                OR: [{ sortOrder: { gt: holiday.sortOrder } }, { sortOrder: holiday.sortOrder, createdAt: { gt: holiday.createdAt } }],
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 4,
            include: holidayInclude,
        });

        return { holiday, holidays };
    }

    async create(dto: CreateHolidayDto) {
        const exists = await this.prisma.holiday.findFirst({ where: { name: dto.name }, select: { id: true } });
        if (exists) throw new ConflictException(`A holiday with name ${dto.name.toLowerCase()} already exists`);

        return this.prisma.holiday.create({
            data: dto,
        });
    }

    async update(id: string, dto: UpdateHolidayDto) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id }, select: { id: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        if (dto.name) {
            const exists = await this.prisma.holiday.findFirst({ where: { name: dto.name }, select: { id: true } });
            if (exists && exists.id !== id) {
                throw new ConflictException(`A holiday with name ${dto.name.toLowerCase()} already exists`);
            }
        }

        return this.prisma.holiday.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id }, select: { id: true, image: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        const deleted = await this.prisma.holiday.delete({ where: { id } });
        if (holiday.image) {
            await this.uploadService.deleteImage(holiday.image);
        }
        return deleted;
    }
}
