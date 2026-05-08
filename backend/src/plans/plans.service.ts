import { PrismaService } from "@/common/services/prisma.service";
import { PlanCode } from "@/generated/prisma/enums";
import { CreatePlanDto } from "@/plans/dto/create-plan.dto";
import { UpdatePlanDto } from "@/plans/dto/update-plan.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const planInclude = {
    features: {
        orderBy: { sortOrder: "asc" as const },
        select: { id: true, text: true, sortOrder: true },
    },
} as const;

@Injectable()
export class PlansService {
    constructor(private readonly prisma: PrismaService) {}

    async list() {
        const items = await this.prisma.plan.findMany({
            where: { isActive: true },
            include: planInclude,
            orderBy: { sortOrder: "asc" },
        });
        return { items };
    }

    async listAll() {
        const items = await this.prisma.plan.findMany({
            include: planInclude,
            orderBy: { sortOrder: "asc" },
        });
        return { items };
    }

    async getById(id: string) {
        const plan = await this.prisma.plan.findUnique({ where: { id }, include: planInclude });
        if (!plan) throw new NotFoundException("Plan not found");
        return plan;
    }

    async create(dto: CreatePlanDto) {
        const exists = await this.prisma.plan.findUnique({ where: { code: dto.code as PlanCode }, select: { id: true } });
        if (exists) throw new ConflictException(`A plan with code ${dto.code} already exists`);

        return this.prisma.plan.create({
            data: {
                code: dto.code as PlanCode,
                name: dto.name,
                description: dto.description,
                monthlyPrice: dto.monthlyPrice,
                yearlyPrice: dto.yearlyPrice,
                holidaysPerYear: dto.holidaysPerYear ?? 3,
                kitDiscount: dto.kitDiscount ?? 0,
                addOnDiscount: dto.addOnDiscount ?? 0,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
                features: {
                    create: dto.features.map((text, i) => ({ text, sortOrder: i })),
                },
            },
            include: planInclude,
        });
    }

    async update(id: string, dto: UpdatePlanDto) {
        const plan = await this.prisma.plan.findUnique({ where: { id }, select: { id: true } });
        if (!plan) throw new NotFoundException("Plan not found");

        return this.prisma.$transaction(async (tx) => {
            if (dto.features !== undefined) {
                await tx.planFeature.deleteMany({ where: { planId: id } });
                await tx.planFeature.createMany({
                    data: dto.features.map((text, i) => ({ planId: id, text, sortOrder: i })),
                });
            }

            return tx.plan.update({
                where: { id },
                data: {
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.description !== undefined && { description: dto.description }),
                    ...(dto.monthlyPrice !== undefined && { monthlyPrice: dto.monthlyPrice }),
                    ...(dto.yearlyPrice !== undefined && { yearlyPrice: dto.yearlyPrice }),
                    ...(dto.holidaysPerYear !== undefined && { holidaysPerYear: dto.holidaysPerYear }),
                    ...(dto.kitDiscount !== undefined && { kitDiscount: dto.kitDiscount }),
                    ...(dto.addOnDiscount !== undefined && { addOnDiscount: dto.addOnDiscount }),
                    ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                    ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
                },
                include: planInclude,
            });
        });
    }
}
