import { HolidaysController } from "@/holidays/holidays.controller";
import { HolidaysService } from "@/holidays/holidays.service";
import { UploadModule } from "@/upload/upload.module";
import { Module } from "@nestjs/common";

@Module({
    imports: [UploadModule],
    controllers: [HolidaysController],
    providers: [HolidaysService],
    exports: [HolidaysService],
})
export class HolidaysModule {}
