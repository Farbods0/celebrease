import { AddOnStatus } from "@/generated/prisma/enums";
import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

export class UpdateAddOnDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    sku?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    image?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    deposit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    inventory?: number;

    @IsOptional()
    @IsEnum(AddOnStatus)
    status?: AddOnStatus;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(50)
    @IsString({ each: true })
    holidayIds?: string[];
}
