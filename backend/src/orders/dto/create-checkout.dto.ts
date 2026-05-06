import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsOptional, IsString } from "class-validator";

export const DELIVERY_OPTIONS = ["STANDARD", "EXPRESS"] as const;
export type DeliveryOption = (typeof DELIVERY_OPTIONS)[number];

export class CreateCheckoutDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @Type(() => String)
    cartIds: string[];

    @IsIn(DELIVERY_OPTIONS)
    deliveryOption: DeliveryOption;

    @IsString()
    @IsOptional()
    deliveryNotes?: string;
}
