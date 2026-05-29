import { SubscriptionStatus } from "@/generated/prisma/enums";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export class AdminUpdateSubscriptionDto {
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;
}

export class AssignHolidaySlotDto {
    @IsString()
    holidayId: string;
}
