import { HolidayCategory } from "@/generated/prisma/enums";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateHolidayDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsEnum(HolidayCategory)
    @IsNotEmpty()
    category: HolidayCategory;

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
