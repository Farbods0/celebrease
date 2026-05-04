import { AddOnsController } from "@/addons/addons.controller";
import { AddOnsService } from "@/addons/addons.service";
import { UploadModule } from "@/upload/upload.module";
import { Module } from "@nestjs/common";

@Module({
    imports: [UploadModule],
    controllers: [AddOnsController],
    providers: [AddOnsService],
    exports: [AddOnsService],
})
export class AddOnsModule {}
