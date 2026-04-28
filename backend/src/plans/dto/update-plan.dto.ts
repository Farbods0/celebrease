import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

export class UpdatePlanDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    monthlyPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yearlyPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    holidaysPerYear?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    sortOrder?: number;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @IsString({ each: true })
    @MaxLength(200, { each: true })
    features?: string[];
}
