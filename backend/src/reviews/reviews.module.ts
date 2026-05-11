import { ReviewsController } from "@/reviews/reviews.controller";
import { ReviewsService } from "@/reviews/reviews.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
