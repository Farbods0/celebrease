import { BadRequestException, Controller, Delete, HttpCode, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { promises as fs } from "fs";
import { basename, join } from "path";

const uploadDir = join(process.cwd(), "uploads");

@Controller("upload")
export class UploadController {
    @Post("image")
    @UseInterceptors(FileInterceptor("file"))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }
        return { url: `/uploads/${file.filename}` };
    }

    @Delete("image")
    @HttpCode(204)
    async deleteImage(@Query("url") url?: string) {
        if (!url) {
            throw new BadRequestException("Missing url");
        }

        const filename = basename(url);
        if (!filename || filename.includes("..") || filename.includes("/")) {
            throw new BadRequestException("Invalid filename");
        }

        const filePath = join(uploadDir, filename);
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
