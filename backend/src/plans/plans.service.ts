import { PrismaService } from "@/common/services/prisma.service";
import { StripeService } from "@/stripe/stripe.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PlanCode } from "@/generated/prisma/enums";
import { CreatePlanDto } from "@/plans/dto/create-plan.dto";
import { UpdatePlanDto } from "@/plans/dto/update-plan.dto";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";

const planInclude = {
    features: {
        orderBy: { sortOrder: "asc" as const },
        select: { id: true, text: true, sortOrder: true },
    },
} as const;

@Injectable()
export class PlansService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stripe: StripeService,
    ) {}

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
        const exists = await this.prisma.plan.findUnique({ where: { code: dto.code }, select: { id: true } });
        if (exists) throw new ConflictException(`A plan with code ${dto.code} already exists`);

        const product = await this.stripe.createProduct({
            name: dto.name,
            description: dto.description,
            planId: dto.code,
        });

        const [monthlyPrice, yearlyPrice] = await Promise.all([
            this.stripe.createPrice({
                productId: product.id,
                unitAmountCents: Math.round(dto.monthlyPrice * 100),
                interval: "month",
                metadata: { planId: dto.code, billingCycle: "MONTHLY" },
            }),
            dto.yearlyPrice
                ? this.stripe.createPrice({
                      productId: product.id,
                      unitAmountCents: Math.round(dto.yearlyPrice * 100),
                      interval: "year",
                      metadata: { planId: dto.code, billingCycle: "YEARLY" },
                  })
                : null,
        ]);

        return this.prisma.plan.create({
            data: {
                code: dto.code,
                name: dto.name,
                description: dto.description,
                monthlyPrice: dto.monthlyPrice,
                yearlyPrice: dto.yearlyPrice,
                holidaysPerYear: dto.holidaysPerYear ?? 3,
                kitDiscount: dto.kitDiscount ?? 0,
                addOnDiscount: dto.addOnDiscount ?? 0,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
                stripeProductId: product.id,
                stripePriceMonthlyId: monthlyPrice.id,
                stripePriceYearlyId: yearlyPrice?.id ?? null,
                features: {
                    create: dto.features.map((text, i) => ({ text, sortOrder: i })),
                },
            },
            include: planInclude,
        });
    }

    async update(id: string, dto: UpdatePlanDto) {
        const plan = await this.prisma.plan.findUnique({
            where: { id },
            select: {
                id: true,
                stripeProductId: true,
                stripePriceMonthlyId: true,
                stripePriceYearlyId: true,
            },
        });
        if (!plan) throw new NotFoundException("Plan not found");

        return this.prisma.$transaction(async (tx) => {
            if (dto.features !== undefined) {
                await tx.planFeature.deleteMany({ where: { planId: id } });
                await tx.planFeature.createMany({
                    data: dto.features.map((text, i) => ({ planId: id, text, sortOrder: i })),
                });
            }

            const updateData: Record<string, unknown> = {};
            if (dto.name !== undefined) updateData.name = dto.name;
            if (dto.description !== undefined) updateData.description = dto.description;
            if (dto.monthlyPrice !== undefined) updateData.monthlyPrice = dto.monthlyPrice;
            if (dto.yearlyPrice !== undefined) updateData.yearlyPrice = dto.yearlyPrice;
            if (dto.holidaysPerYear !== undefined) updateData.holidaysPerYear = dto.holidaysPerYear;
            if (dto.kitDiscount !== undefined) updateData.kitDiscount = dto.kitDiscount;
            if (dto.addOnDiscount !== undefined) updateData.addOnDiscount = dto.addOnDiscount;
            if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
            if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

            if (plan.stripeProductId && (dto.name !== undefined || dto.description !== undefined)) {
                await this.stripe.updateProduct(plan.stripeProductId, {
                    name: dto.name,
                    description: dto.description,
                });
            }

            if (dto.monthlyPrice !== undefined && plan.stripePriceMonthlyId) {
                const newPrice = await this.stripe.updatePrice(plan.stripePriceMonthlyId, Math.round(dto.monthlyPrice * 100));
                updateData.stripePriceMonthlyId = newPrice.id;
            }
            if (dto.yearlyPrice !== undefined && plan.stripePriceYearlyId) {
                const newPrice = await this.stripe.updatePrice(plan.stripePriceYearlyId, Math.round(dto.yearlyPrice * 100));
                updateData.stripePriceYearlyId = newPrice.id;
            }

            if (Object.keys(updateData).length > 0) {
                await tx.plan.update({ where: { id }, data: updateData });
            }

            return tx.plan.findUnique({ where: { id }, include: planInclude });
        });
    }

    async remove(id: string) {
        const plan = await this.prisma.plan.findUnique({
            where: { id },
            select: {
                id: true,
                stripeProductId: true,
                _count: { select: { subscriptions: true } },
            },
        });
        if (!plan) throw new NotFoundException("Plan not found");
        if (plan._count.subscriptions > 0) {
            throw new BadRequestException("Cannot delete a plan that has subscriptions. Toggle isActive=false to hide it instead.");
        }

        if (plan.stripeProductId) {
            await this.stripe.archiveProduct(plan.stripeProductId).catch(() => undefined);
        }

        await this.prisma.plan.delete({ where: { id } });
        return { id };
    }
}
