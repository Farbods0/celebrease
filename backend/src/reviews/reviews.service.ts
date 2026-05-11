import { PrismaService } from "@/common/services/prisma.service";
import { CreateReviewDto } from "@/reviews/dto/create-review.dto";
import { ListReviewsDto } from "@/reviews/dto/list-reviews.dto";
import { UpdateReviewDto } from "@/reviews/dto/update-review.dto";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) {}

    async list(query: ListReviewsDto) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        const where = {
            ...(search
                ? {
                      OR: [
                          { name: { contains: search, mode: "insensitive" as const } },
                          { content: { contains: search, mode: "insensitive" as const } },
                      ],
                  }
                : {}),
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.review.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.review.count({ where }),
        ]);

        return { items, total };
    }

    async create(dto: CreateReviewDto) {
        return this.prisma.review.create({
            data: {
                name: dto.name,
                image: dto.image,
                rating: dto.rating,
                content: dto.content,
                isActive: dto.isActive ?? true,
            },
        });
    }

    async update(id: string, dto: UpdateReviewDto) {
        const review = await this.prisma.review.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.image !== undefined && { image: dto.image }),
                ...(dto.rating !== undefined && { rating: dto.rating }),
                ...(dto.content !== undefined && { content: dto.content }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });

        if (!review) throw new NotFoundException("Review not found");

        return review;
    }

    async getActiveReviews() {
        return this.prisma.review.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
    }
}
