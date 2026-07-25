import { KitStatus, KitTier } from "@/generated/prisma/enums";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class UpdateKitDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    sku?: string;

    @IsOptional()
    @IsEnum(KitTier)
    tier?: KitTier;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    holidayId?: string;

    @IsOptional()
    @IsEnum(KitStatus)
    status?: KitStatus;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price30Day?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price60Day?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    deposit?: number;

    @IsOptional()
    @IsDateString()
    seasonStart?: string | null;

    @IsOptional()
    @IsDateString()
    seasonEnd?: string | null;

    @IsOptional()
    @IsBoolean()
    alwaysVisible?: boolean;

    @IsOptional()
    @IsBoolean()
    visibleOnPdp?: boolean;

    @IsOptional()
    @IsBoolean()
    addOnsEnabled?: boolean;

    @IsOptional()
    @IsBoolean()
    limitInventory?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
