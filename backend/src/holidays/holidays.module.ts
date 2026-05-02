import { HolidaysController } from "@/holidays/holidays.controller";
import { HolidaysService } from "@/holidays/holidays.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [HolidaysController],
    providers: [HolidaysService],
    exports: [HolidaysService],
})
export class HolidaysModule {}
