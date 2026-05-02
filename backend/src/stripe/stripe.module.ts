import { StripeService } from "@/stripe/stripe.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    providers: [StripeService],
    exports: [StripeService],
})
export class StripeModule {}
