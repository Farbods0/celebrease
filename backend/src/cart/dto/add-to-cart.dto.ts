import { Duration } from "@/generated/prisma/enums";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class CartAddOnDto {
    @IsString()
    @IsNotEmpty()
    addOnId: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    qty?: number;
}

export class AddToCartDto {
    @IsString()
    @IsNotEmpty()
    holidayId: string;

    @IsString()
    @IsNotEmpty()
    kitId: string;

    @IsEnum(Duration)
    duration: Duration;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CartAddOnDto)
    @ArrayMinSize(0)
    addOns?: CartAddOnDto[];
}
