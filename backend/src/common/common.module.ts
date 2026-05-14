import { ContactController } from "@/common/controllers/contact.controller";
import { EmailService } from "@/common/services/email.service";
import { PrismaService } from "@/common/services/prisma.service";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

@Global()
@Module({
    imports: [
        AuthModule.forRootAsync({
            inject: [ConfigService, PrismaService, EmailService],
            useFactory: (configService: ConfigService, prismaService: PrismaService, emailService: EmailService) => ({
                auth: betterAuth({
                    appName: "CeleBrease",
                    baseURL: configService.get<string>("betterAuth.url")!,
                    secret: configService.get<string>("betterAuth.secret")!,
                    database: prismaAdapter(prismaService, {
                        provider: "postgresql",
                    }),
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
                            },
                            banned: {
                                type: "boolean",
                                defaultValue: false,
                            },
                            phone: {
                                type: "string",
                                required: false,
                            },
                            region: {
                                type: "string",
                                required: false,
                            },
                        },
                    },
                    trustedOrigins: configService.get<string>("client")?.split(",") || [],
                    advanced: {
                        defaultCookieAttributes: {
                            sameSite: "none",
                            secure: true,
                        },
                    },
                }),
            }),
        }),
    ],
    controllers: [ContactController],
    providers: [PrismaService, EmailService],
    exports: [PrismaService, EmailService],
})
export class CommonModule {}
