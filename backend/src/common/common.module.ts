import { ContactController } from "@/common/controllers/contact.controller";
import { NewsletterController } from "@/common/controllers/newsletter.controller";
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
                            console.log(`[AUTH] Verification link for ${data.user.email}: ${data.url}`);
                            emailService.verifyEmail({
                                email: data.user.email,
                                url: data.url,
                            }).catch(err => console.error("Failed to send verification email:", err));
                        },
                    },
                    emailAndPassword: {
                        enabled: true,
                        requireVerification: true,
                        sendResetPassword: async (data) => {
                            console.log(`[AUTH] Password reset link for ${data.user.email}: ${data.url}`);
                            emailService.resetPassword({
                                email: data.user.email,
                                url: data.url,
                            }).catch(err => console.error("Failed to send reset email:", err));
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
                    socialProviders: {
                        google: {
                            clientId: configService.get<string>("google.clientId") || process.env.GOOGLE_CLIENT_ID || "",
                            clientSecret: configService.get<string>("google.clientSecret") || process.env.GOOGLE_CLIENT_SECRET || "",
                        },
                    },
                    trustedOrigins: configService.get<string>("client")?.split(",") || [],
                    advanced: {
                        // Production (HTTPS): cross-site cookies require sameSite=none + secure.
                        // Development (HTTP localhost): secure=true cookies are silently dropped by
                        // the browser, so we must use sameSite=lax + secure=false.
                        defaultCookieAttributes: configService.get<string>("nodeEnv") === "production"
                            ? { sameSite: "none" as const, secure: true }
                            : { sameSite: "lax" as const, secure: false },
                    },
                }),
            }),
        }),
    ],
    controllers: [ContactController, NewsletterController],
    providers: [PrismaService, EmailService],
    exports: [PrismaService, EmailService],
})
export class CommonModule {}
