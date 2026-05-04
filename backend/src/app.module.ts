import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { CommonModule } from "@/common/common.module";
import { config } from "@/config/env.config";
import { HolidaysModule } from "@/holidays/holidays.module";
import { KitsModule } from "@/kits/kits.module";
import { PlansModule } from "@/plans/plans.module";
import { StripeModule } from "@/stripe/stripe.module";
import { SubscriptionsModule } from "@/subscriptions/subscriptions.module";
import { UploadModule } from "@/upload/upload.module";
import { UsersModule } from "@/users/users.module";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AuthGuard } from "@thallesp/nestjs-better-auth";
import { join } from "path";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), "uploads"),
            serveRoot: "/uploads",
        }),
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
        UploadModule,
        UsersModule,
        PlansModule,
        SubscriptionsModule,
        HolidaysModule,
        KitsModule,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
