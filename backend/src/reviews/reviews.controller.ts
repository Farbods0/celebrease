import { CreateReviewDto } from "@/reviews/dto/create-review.dto";
import { ListReviewsDto } from "@/reviews/dto/list-reviews.dto";
import { ReviewsService } from "@/reviews/reviews.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Roles } from "@thallesp/nestjs-better-auth";

@Controller("/review")
@Roles(["admin", "superadmin"])
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    list(@Query() query: ListReviewsDto) {
        return this.reviewsService.list(query);
    }

    @Get("active")
    getActiveReviews() {
        return this.reviewsService.getActiveReviews();
    }

    @Post()
    create(@Body() dto: CreateReviewDto) {
        return this.reviewsService.create(dto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: CreateReviewDto) {
        return this.reviewsService.update(id, dto);
    }
}
