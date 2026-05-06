import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListOrdersDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit: number = 20;

    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    @IsIn(["active", "recent"])
    filter?: "active" | "recent";
}
