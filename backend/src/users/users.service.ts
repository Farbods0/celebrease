import { PrismaService } from "@/common/services/prisma.service";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { ListUsersDto } from "@/users/dto/list-users.dto";
import { UpdateUserDto } from "@/users/dto/update-user.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        const where = {
            ...(session.user.role !== "superadmin" ? { role: "user" } : {}),
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
}
