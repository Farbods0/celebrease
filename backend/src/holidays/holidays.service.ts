import { PrismaService } from "@/common/services/prisma.service";
import { CreateHolidayDto } from "@/holidays/dto/create-holiday.dto";
import { AddHolidayAddOnDto } from "@/holidays/dto/holiday-addon.dto";
import { UpdateHolidayDto } from "@/holidays/dto/update-holiday.dto";
import { UploadService } from "@/upload/upload.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const holidayKitInclude = {
    kits: {
        select: {
            id: true,
            sku: true,
            tier: true,
            price30Day: true,
            price60Day: true,
            deposit: true,
        },
    },
};

const holidayAddOnInclude = {
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

const holidayKitSelect = {
    id: true,
    sku: true,
    tier: true,
    price30Day: true,
    price60Day: true,
    deposit: true,
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
                },
            },
        },
    },
};

const holidayAddOnSelect = {
    addOn: {
        select: {
            id: true,
            sku: true,
            name: true,
            image: true,
            price: true,
            deposit: true,
        },
    },
};

@Injectable()
export class HolidaysService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async list(query: Record<string, string | undefined>) {
        const addon = query?.addon === "true";
        const items = await this.prisma.holiday.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
                ...holidayKitInclude,
                ...(addon ? holidayAddOnInclude : {}),
            },
        });
        return { items };
    }

    async listAll() {
        const items = await this.prisma.holiday.findMany({
            orderBy: { sortOrder: "asc" },
            include: holidayKitInclude,
        });
        return { items };
    }

    async listByLoves() {
        const items = await this.prisma.holiday.findMany({
            where: { isActive: true },
            orderBy: {
                loves: { _count: "desc" },
            },
            include: holidayKitInclude,
        });
        return { items };
    }

    async getById(id: string) {
        const holiday = await this.prisma.holiday.findUnique({
            where: { id },
        });
        if (!holiday) throw new NotFoundException("Holiday not found");

        const [kits, addOns, holidays] = await Promise.all([
            this.prisma.kit.findMany({
                where: { holidayId: holiday.id },
                select: holidayKitSelect,
            }),
            this.prisma.addOnHoliday.findMany({
                where: { holidayId: holiday.id },
                select: holidayAddOnSelect,
            }),
            this.prisma.holiday.findMany({
                where: {
                    isActive: true,
                    id: { not: id },
                    OR: [{ sortOrder: { gt: holiday.sortOrder } }, { sortOrder: holiday.sortOrder, createdAt: { gt: holiday.createdAt } }],
                },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                take: 4,
                include: holidayKitInclude,
            }),
        ]);

        return { holiday, kits, addOns, holidays };
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

    async addAddOn(holidayId: string, dto: AddHolidayAddOnDto) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id: holidayId }, select: { id: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        const addOn = await this.prisma.addOn.findUnique({ where: { id: dto.addOnId }, select: { id: true } });
        if (!addOn) throw new NotFoundException("Add-on not found");

        const exists = await this.prisma.addOnHoliday.findUnique({
            where: { addOnId_holidayId: { addOnId: dto.addOnId, holidayId } },
            select: { addOnId: true },
        });
        if (exists) throw new ConflictException("This add-on is already linked to the holiday");

        return this.prisma.addOnHoliday.create({
            data: { addOnId: dto.addOnId, holidayId },
        });
    }

    async removeAddOn(holidayId: string, addOnId: string) {
        const link = await this.prisma.addOnHoliday.findUnique({
            where: { addOnId_holidayId: { addOnId, holidayId } },
            select: { addOnId: true },
        });
        if (!link) throw new NotFoundException("Add-on link not found");

        return this.prisma.addOnHoliday.delete({
            where: { addOnId_holidayId: { addOnId, holidayId } },
        });
    }

    async listMyLoves(userId: string) {
        const loves = await this.prisma.holidayLove.findMany({
            where: { userId },
            select: { holidayId: true },
        });
        return { holidayIds: loves.map((l) => l.holidayId) };
    }

    async love(holidayId: string, userId: string) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id: holidayId }, select: { id: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        await this.prisma.holidayLove.upsert({
            where: { userId_holidayId: { userId, holidayId } },
            create: { userId, holidayId },
            update: {},
        });
        const count = await this.prisma.holidayLove.count({ where: { holidayId } });
        return { loved: true, loveCount: count };
    }

    async unlove(holidayId: string, userId: string) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id: holidayId }, select: { id: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        await this.prisma.holidayLove.deleteMany({ where: { userId, holidayId } });
        const count = await this.prisma.holidayLove.count({ where: { holidayId } });
        return { loved: false, loveCount: count };
    }
}
