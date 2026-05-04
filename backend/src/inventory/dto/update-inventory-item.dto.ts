import { InventoryStatus } from "@/generated/prisma/enums";
import { KitMappingDto } from "@/inventory/dto/create-inventory-item.dto";
import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    IsArray,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
    ValidateNested,
} from "class-validator";

export class UpdateInventoryItemDto {
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
    @IsString()
    @MaxLength(64)
    category?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    vendorName?: string;

    @IsOptional()
    @IsEmail()
    vendorEmail?: string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    vendorPhone?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    costPerUnit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    totalQty?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    lowStockThreshold?: number;

    @IsOptional()
    @IsEnum(InventoryStatus)
    status?: InventoryStatus;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => KitMappingDto)
    kits?: KitMappingDto[];
}
