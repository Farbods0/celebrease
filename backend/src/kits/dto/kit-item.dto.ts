import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

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
