import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export const RETURN_CONDITIONS = ["GOOD", "DAMAGED", "MISSING", "LOST"] as const;
export type ReturnConditionDto = (typeof RETURN_CONDITIONS)[number];

export class InspectReturnLineDto {
    @IsString()
    @IsOptional()
    itemId?: string;

    @IsString()
    @IsOptional()
    addOnId?: string;

    @IsInt()
    @Min(1)
    qty: number;

    @IsIn(RETURN_CONDITIONS)
    condition: ReturnConditionDto;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    feeCharged?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class InspectReturnDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => InspectReturnLineDto)
    lines: InspectReturnLineDto[];

    @IsString()
    @IsOptional()
    inspectionNotes?: string;
}
