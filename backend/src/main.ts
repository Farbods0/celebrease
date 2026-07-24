import { AppModule } from "@/app.module";
import { ConsoleLogger, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

async function bootstrap() {
    const logger = new ConsoleLogger({
        logLevels: ["warn", "error", "log", "debug", "verbose", "fatal"],
        prefix: "CeleBrease",
        timestamp: true,
    });

    const app = await NestFactory.create(AppModule, { logger, rawBody: true });
    const configService = app.get(ConfigService);

    // Security. Allow the frontend/admin (different origins) to embed images
    // served from /uploads — Helmet's default Cross-Origin-Resource-Policy:
    // same-origin otherwise blocks every <img> (ERR_BLOCKED_BY_RESPONSE.NotSameOrigin).
    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

    // CORS
    app.enableCors({
        origin: configService.get<string>("client")?.split(",") || [],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    // Global prefix
    const apiPrefix = configService.get<string>("apiPrefix");
    app.setGlobalPrefix(apiPrefix || "api");

    // Port
    const port = configService.get<number>("port");
    await app.listen(port || 5000);

    logger.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
