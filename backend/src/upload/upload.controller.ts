import { BadRequestException, Controller, Delete, HttpCode, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { promises as fs } from "fs";
import { join } from "path";

const uploadDir = join(process.cwd(), "uploads");

@Controller("upload")
export class UploadController {
    @Post("image")
    @UseInterceptors(FileInterceptor("file"))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Query("folder") folder?: string) {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }
        const url = folder ? `/uploads/${folder}/${file.filename}` : `/uploads/${file.filename}`;
        return { url };
    }

    @Delete("image")
    @HttpCode(204)
    async deleteImage(@Query("url") url?: string) {
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
