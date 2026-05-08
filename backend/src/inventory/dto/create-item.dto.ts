import { ItemStatus } from "@/generated/prisma/enums";
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

export class KitMappingDto {
    @IsString()
    @IsNotEmpty()
    kitId: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    qty: number;
}

export class CreateItemDto {
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    sku: string;

    @IsString()
    @MinLength(2)
    @MaxLength(120)
    name: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    category?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(120)
    vendorName: string;

    @IsEmail()
    vendorEmail: string;

    @IsString()
    @MinLength(4)
    @MaxLength(32)
    vendorPhone: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    costPerUnit: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    totalQty: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    lowStockThreshold?: number;

    @IsOptional()
    @IsEnum(ItemStatus)
    status?: ItemStatus;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => KitMappingDto)
    kits?: KitMappingDto[];
}
