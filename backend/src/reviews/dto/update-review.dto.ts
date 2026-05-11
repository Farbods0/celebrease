import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateReviewDto {
    @IsOptional()
    @IsString()
    @MaxLength(64)
    name?: string;

    @IsOptional()
    @IsString()
    image?: string | null;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
