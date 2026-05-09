import { IsOptional, IsString } from "class-validator";

/** Admin-only DTO for PATCH /order/admin/:id/return-label. */
export class SetReturnLabelDto {
    @IsString()
    @IsOptional()
    returnLabelUrl?: string;

    @IsString()
    @IsOptional()
    returnTrackingNumber?: string;

    @IsString()
    @IsOptional()
    returnTrackingUrl?: string;
}
