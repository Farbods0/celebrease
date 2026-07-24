import { CreateReviewDto } from "@/reviews/dto/create-review.dto";
import { ListReviewsDto } from "@/reviews/dto/list-reviews.dto";
import { UpdateReviewDto } from "@/reviews/dto/update-review.dto";
import { ReviewsService } from "@/reviews/reviews.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

@Controller("/review")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    @Roles(["admin", "superadmin"])
    list(@Query() query: ListReviewsDto) {
        return this.reviewsService.list(query);
    }

    @Get("active")
    @AllowAnonymous()
    getActiveReviews() {
        return this.reviewsService.getActiveReviews();
    }

    @Post()
    @Roles(["admin", "superadmin"])
    create(@Body() dto: CreateReviewDto) {
        return this.reviewsService.create(dto);
    }

    @Patch(":id")
    @Roles(["admin", "superadmin"])
    update(@Param("id") id: string, @Body() dto: UpdateReviewDto) {
        return this.reviewsService.update(id, dto);
    }

    @Delete(":id")
    @Roles(["admin", "superadmin"])
    remove(@Param("id") id: string) {
        return this.reviewsService.remove(id);
    }
}
