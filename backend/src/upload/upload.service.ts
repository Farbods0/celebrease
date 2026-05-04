import { BadRequestException, Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import { join } from "path";

const uploadDir = join(process.cwd(), "uploads");

@Injectable()
export class UploadService {
    uploadImage(file: Express.Multer.File, folder?: string) {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }
        const url = folder ? `/uploads/${folder}/${file.filename}` : `/uploads/${file.filename}`;
        return { url };
    }

    async deleteImage(url?: string) {
        if (!url) {
            throw new BadRequestException("Missing url");
        }

        const prefix = "/uploads/";
        if (!url.startsWith(prefix)) {
            throw new BadRequestException("Invalid url");
        }

        const segments = url.slice(prefix.length).split("/");
        if (segments.length < 1 || segments.length > 2 || segments.some((s) => !/^[a-zA-Z0-9._-]+$/.test(s))) {
            throw new BadRequestException("Invalid url");
        }

        const filePath = join(uploadDir, ...segments);
        try {
            await fs.unlink(filePath);
        } catch (err: unknown) {
            const code = (err as NodeJS.ErrnoException)?.code;
            if (code !== "ENOENT") {
                throw err;
            }
        }
    }
}
