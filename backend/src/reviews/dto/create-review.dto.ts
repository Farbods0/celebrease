import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDto {
    @IsString()
    @MaxLength(64)
    name: string;

    @IsOptional()
    @IsString()
    image?: string | null;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @MaxLength(1000)
    content: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}
