import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { CommonModule } from "@/common/common.module";
import { config } from "@/config/env.config";
import { PlansModule } from "@/plans/plans.module";
import { StripeModule } from "@/stripe/stripe.module";
import { SubscriptionsModule } from "@/subscriptions/subscriptions.module";
import { UsersModule } from "@/users/users.module";
import { HolidaysModule } from "@/holidays/holidays.module";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "@thallesp/nestjs-better-auth";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            envFilePath: ".env",
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        CommonModule,
        StripeModule,
        UsersModule,
        PlansModule,
        SubscriptionsModule,
        HolidaysModule,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
