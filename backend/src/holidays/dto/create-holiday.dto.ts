import { HolidayCategory } from "@/generated/prisma/enums";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHolidayDto {
    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(HolidayCategory)
    @IsNotEmpty()
    category: HolidayCategory;

    @IsString()
    @IsOptional()
    iconUrl?: string;

    @IsString()
    @IsOptional()
    coverUrl?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsOptional()
    sortOrder?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
