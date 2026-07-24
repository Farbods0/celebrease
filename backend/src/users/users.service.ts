import { PrismaService } from "@/common/services/prisma.service";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { ListUsersDto } from "@/users/dto/list-users.dto";
import { UpdateUserDto } from "@/users/dto/update-user.dto";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { hashPassword } from "better-auth/crypto";
import { randomBytes } from "node:crypto";

const userSelect = {
    id: true,
    name: true,
    email: true,
    image: true,
    role: true,
    banned: true,
    phone: true,
    region: true,
    createdAt: true,
    updatedAt: true,
} as const;

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async list(query: ListUsersDto, session: UserSession) {
        const { page, limit, search, role } = query;
        const skip = (page - 1) * limit;

        // Superadmins see all roles (user, admin, superadmin); admins see users
        // and other admins (but not superadmins). Restricting role visibility is
        // intentional so a regular admin can't escalate by editing a superadmin.
        const visibleRoles = session.user.role === "superadmin" ? ["user", "admin", "superadmin"] : ["user", "admin"];
        // When the user filters by role from the UI, intersect with the visible set.
        const effectiveRoles = role === "admin" ? visibleRoles.filter((r) => r !== "user") : role === "user" ? ["user"] : visibleRoles;

        const where = {
            role: { in: effectiveRoles },
            ...(search
                ? {
                      OR: [
                          { name: { contains: search, mode: "insensitive" as const } },
                          { email: { contains: search, mode: "insensitive" as const } },
                      ],
                  }
                : {}),
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                select: userSelect,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);

        return { items, total };
    }

    async getById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
        if (!user) throw new NotFoundException("User not found");
        return user;
    }

    async create(dto: CreateUserDto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email }, select: { id: true } });
        if (exists) throw new ConflictException("A user with this email already exists");

        const hashed = await hashPassword(dto.password);
        const userId = randomBytes(16).toString("hex");
        const accountId = randomBytes(16).toString("hex");

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    id: userId,
                    name: dto.name,
                    email: dto.email,
                    emailVerified: true,
                    role: dto.role ?? "user",
                    phone: dto.phone,
                    region: dto.region,
                },
                select: userSelect,
            });

            await tx.account.create({
                data: {
                    id: accountId,
                    accountId: user.id,
                    providerId: "credential",
                    userId: user.id,
                    password: hashed,
                },
            });

            return user;
        });
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.role !== undefined && { role: dto.role }),
                ...(dto.banned !== undefined && { banned: dto.banned }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.region !== undefined && { region: dto.region }),
            },
            select: userSelect,
        });

        if (!user) throw new NotFoundException("User not found");

        return user;
    }

    async listCustomers(query: ListUsersDto) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        // A customer is a user with at least one paid, non-cancelled order.
        const validOrderFilter = {
            paymentStatus: "PAID" as const,
            status: { not: "CANCELLED" as const },
        };

        const where = {
            role: "user",
            orders: { some: validOrderFilter },
            ...(search
                ? {
                      OR: [
                          { name: { contains: search, mode: "insensitive" as const } },
                          { email: { contains: search, mode: "insensitive" as const } },
                      ],
                  }
                : {}),
        };

        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    region: true,
                    banned: true,
                    createdAt: true,
                    address: {
                        select: {
                            country: true,
                        },
                    },
                    orders: {
                        where: validOrderFilter,
                        select: { status: true, kitDeposit: true, addOnDeposit: true },
                    },
                    subscriptions: {
                        where: { status: { in: ["ACTIVE", "PAUSED"] } },
                        select: { id: true },
                        take: 1,
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);

        const items = users.map((u) => {
            const orderCount = u.orders.length;
            const completedCount = u.orders.filter((o) => o.status === "COMPLETED").length;
            const depositsHeld = u.orders
                .filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
                .reduce((sum, o) => sum + Number(o.kitDeposit) + Number(o.addOnDeposit), 0);

            return {
                id: u.id,
                name: u.name,
                email: u.email,
                image: u.image,
                phone: u.phone,
                region: u.region ?? u.address?.country,
                banned: u.banned,
                createdAt: u.createdAt,
                orderCount,
                completedCount,
                hasActiveSubscription: u.subscriptions.length > 0,
                depositsHeld,
            };
        });

        return { items, total };
    }

    async getCustomerById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                region: true,
                banned: true,
                createdAt: true,
                updatedAt: true,
                address: true,
                subscriptions: {
                    orderBy: { createdAt: "desc" as const },
                    take: 1,
                    select: {
                        id: true,
                        status: true,
                        billingCycle: true,
                        startedAt: true,
                        nextBillingAt: true,
                        plan: { select: { id: true, code: true, name: true } },
                    },
                },
                orders: {
                    orderBy: { createdAt: "desc" as const },
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        total: true,
                        kitDeposit: true,
                        addOnDeposit: true,
                        createdAt: true,
                        holiday: { select: { id: true, name: true } },
                        kit: { select: { id: true, tier: true } },
                    },
                },
            },
        });

        if (!user) throw new NotFoundException("Customer not found");

        const orders = user.orders;
        const orderCount = orders.length;
        const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
        const depositsHeld = orders
            .filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
            .reduce((sum, o) => sum + Number(o.kitDeposit) + Number(o.addOnDeposit), 0);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            phone: user.phone,
            region: user.region ?? user.address?.country,
            banned: user.banned,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            orderCount,
            completedCount,
            hasActiveSubscription: (user.subscriptions[0]?.status === "ACTIVE" || user.subscriptions[0]?.status === "PAUSED") ?? false,
            depositsHeld,
            address: user.address,
            subscription: user.subscriptions[0] ?? null,
            recentOrders: orders.slice(0, 10),
        };
    }

    async remove(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
        if (!user) throw new NotFoundException("User not found");
        if (user.role === "superadmin") {
            throw new BadRequestException("Cannot delete a superadmin account");
        }
        await this.prisma.user.delete({ where: { id } });
        return { id };
    }
}
