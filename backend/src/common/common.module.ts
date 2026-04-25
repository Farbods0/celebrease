import { EmailService } from "@/common/services/email.service";
import { PrismaService } from "@/common/services/prisma.service";
import { Cache } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

@Global()
@Module({
    imports: [
        AuthModule.forRootAsync({
            inject: [ConfigService, PrismaService, Cache, EmailService],
            useFactory: (configService: ConfigService, prismaService: PrismaService, cacheService: Cache, emailService: EmailService) => ({
                auth: betterAuth({
                    appName: "CeleBrease",
                    baseURL: configService.get<string>("betterAuth.url")!,
                    secret: configService.get<string>("betterAuth.secret")!,
                    database: prismaAdapter(prismaService, {
                        provider: "postgresql",
                    }),
                    secondaryStorage: {
                        get: async (key) => {
                            return await cacheService.get(key);
                        },
                        set: async (key, value, ttl) => {
                            if (ttl) {
                                await cacheService.set(key, value, ttl);
                            } else {
                                await cacheService.set(key, value);
                            }
                        },
                        delete: async (key) => {
                            await cacheService.del(key);
                        },
                    },
                    emailVerification: {
                        sendOnSignUp: true,
                        sendVerificationEmail: async (data) => {
                            await emailService.verifyEmail({
                                email: data.user.email,
                                url: data.url,
                            });
                        },
                    },
                    emailAndPassword: {
                        enabled: true,
                        requireVerification: true,
                        sendResetPassword: async (data) => {
                            await emailService.resetPassword({
                                email: data.user.email,
                                url: data.url,
                            });
                        },
                    },
                    user: {
                        additionalFields: {
                            role: {
                                type: "string",
                                defaultValue: "user",
                            },
                            phone: {
                                type: "string",
                            },
                            city: {
                                type: "string",
                            },
                            code: {
                                type: "string",
                            },
                            identifier: {
                                type: "string",
                            },
                        },
                    },
                    trustedOrigins: configService.get<string>("client")?.split(",") || [],
                    advanced: {
                        defaultCookieAttributes: {
                            sameSite: "lax",
                            secure: false,
                        },
                    },
                }),
            }),
        }),
    ],
    providers: [PrismaService, EmailService],
    exports: [PrismaService, EmailService],
})
export class CommonModule {}
