import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Manual stock adjustment payload. All fields are optional integers (can be negative)
 * representing the delta to apply to each bucket. Validation in the service ensures
 * the resulting counts are non-negative and consistent with totalQty.
 *
 * Example: to mark 5 returned items as cleaning, set { shippedDelta: -5, cleaningDelta: 5 }.
 */
export class AdjustStockDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    totalDelta?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    availableDelta?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    reservedDelta?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    shippedDelta?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    cleaningDelta?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    repairDelta?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    lostDelta?: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}
