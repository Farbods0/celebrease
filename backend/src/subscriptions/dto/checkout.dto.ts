import { IsIn, IsString } from "class-validator";

const BILLING_CYCLES = ["MONTHLY", "YEARLY"] as const;

export class CreateCheckoutDto {
    @IsString()
    planId: string;

    @IsIn(BILLING_CYCLES)
    billingCycle: (typeof BILLING_CYCLES)[number];
}
