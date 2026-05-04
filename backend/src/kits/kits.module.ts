import { KitsController } from "@/kits/kits.controller";
import { KitsService } from "@/kits/kits.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [KitsController],
    providers: [KitsService],
    exports: [KitsService],
})
export class KitsModule {}
