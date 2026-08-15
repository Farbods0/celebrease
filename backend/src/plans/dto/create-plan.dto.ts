import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

const PLAN_CODES = ["Silver", "Gold", "Platinum"] as const;

export class CreatePlanDto {
    @IsIn(PLAN_CODES)
    code: (typeof PLAN_CODES)[number];

    @IsString()
    @MinLength(2)
    @MaxLength(64)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    monthlyPrice: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yearlyPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    holidaysPerYear?: number = 3;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    sortOrder?: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    kitDiscount?: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    addOnDiscount?: number = 0;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @IsString({ each: true })
    @MaxLength(200, { each: true })
    features: string[];

    @IsOptional()
    @IsBoolean()
    isPopular?: boolean = false;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    buttonLabel?: string;
}
