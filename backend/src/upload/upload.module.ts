import { BadRequestException, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { UploadController } from "./upload.controller";

const uploadDir = join(process.cwd(), "uploads");
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, _file, cb) => {
                    const folder = typeof req.query?.folder === "string" ? req.query.folder : "";
                    if (folder && !/^[a-z0-9-]+$/.test(folder)) {
                        cb(new BadRequestException("Invalid folder"), "");
                        return;
                    }
                    const dest = folder ? join(uploadDir, folder) : uploadDir;
                    mkdirSync(dest, { recursive: true });
                    cb(null, dest);
                },
                filename: (_req, file, cb) => {
                    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${unique}${extname(file.originalname)}`);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (_req, file, cb) => {
                if (/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException("Only PNG, JPG, or WEBP images are allowed"), false);
                }
            },
        }),
    ],
    controllers: [UploadController],
})
export class UploadModule {}
