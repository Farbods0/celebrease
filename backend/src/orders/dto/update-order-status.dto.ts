import { IsIn, IsOptional, IsString } from "class-validator";

export const ADMIN_ORDER_TRANSITIONS = [
    "RESERVED",
    "SHIPPED",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "RETURN_IN_TRANSIT",
    "RETURN_RECEIVED",
] as const;
export type AdminOrderTransition = (typeof ADMIN_ORDER_TRANSITIONS)[number];

export class UpdateOrderStatusDto {
    @IsIn(ADMIN_ORDER_TRANSITIONS)
    status: AdminOrderTransition;

    @IsString()
    @IsOptional()
    trackingNumber?: string;

    @IsString()
    @IsOptional()
    trackingUrl?: string;
}
