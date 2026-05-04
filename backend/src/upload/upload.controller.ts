import { Controller, Delete, HttpCode, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post("image")
    @UseInterceptors(FileInterceptor("file"))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Query("folder") folder?: string) {
        return this.uploadService.uploadImage(file, folder);
    }

    @Delete("image")
    @HttpCode(204)
    async deleteImage(@Query("url") url?: string) {
        await this.uploadService.deleteImage(url);
    }
}
