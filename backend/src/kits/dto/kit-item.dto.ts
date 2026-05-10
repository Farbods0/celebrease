import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class AddKitItemDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    qty?: number;
}

export class AddKitPreviewItemDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;
}

export class ReorderKitPreviewItemsDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    itemIds: string[];
}
