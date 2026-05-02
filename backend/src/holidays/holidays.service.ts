import { PrismaService } from "@/common/services/prisma.service";
import { CreateHolidayDto } from "@/holidays/dto/create-holiday.dto";
import { UpdateHolidayDto } from "@/holidays/dto/update-holiday.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class HolidaysService {
    constructor(private readonly prisma: PrismaService) {}

    async list() {
        const items = await this.prisma.holiday.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        return { items };
    }

    async listAll() {
        const items = await this.prisma.holiday.findMany({
            orderBy: { sortOrder: "asc" },
        });
        return { items };
    }

    async getById(id: string) {
        const holiday = await this.prisma.holiday.findUnique({ where: { id } });
        if (!holiday) throw new NotFoundException("Holiday not found");
        return holiday;
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
        const holiday = await this.prisma.holiday.findUnique({ where: { id }, select: { id: true } });
        if (!holiday) throw new NotFoundException("Holiday not found");

        return this.prisma.holiday.delete({ where: { id } });
    }
}
