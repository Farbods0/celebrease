import { KitStatus, KitTier } from "@/generated/prisma/enums";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateKitDto {
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    sku: string;

    @IsEnum(KitTier)
    tier: KitTier;

    @IsString()
    @IsNotEmpty()
    holidayId: string;

    @IsOptional()
    @IsEnum(KitStatus)
    status?: KitStatus;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price30Day: number;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price60Day: number;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    deposit: number;

    @IsOptional()
    @IsDateString()
    seasonStart?: string;

    @IsOptional()
    @IsDateString()
    seasonEnd?: string;

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
