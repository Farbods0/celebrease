import { CreateHolidayDto } from "@/holidays/dto/create-holiday.dto";
import { UpdateHolidayDto } from "@/holidays/dto/update-holiday.dto";
import { HolidaysService } from "@/holidays/holidays.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

@Controller("holidays")
export class HolidaysController {
    constructor(private readonly holidaysService: HolidaysService) {}

    @Get()
    @AllowAnonymous()
    list() {
        return this.holidaysService.list();
    }

    @Get("admin")
    @Roles(["admin", "superadmin"])
    listAll() {
        return this.holidaysService.listAll();
    }

    @Get(":id")
    @AllowAnonymous()
    get(@Param("id") id: string) {
        return this.holidaysService.getById(id);
    }

    @Post()
    @Roles(["admin", "superadmin"])
    create(@Body() dto: CreateHolidayDto) {
        return this.holidaysService.create(dto);
    }

    @Patch(":id")
    @Roles(["admin", "superadmin"])
    update(@Param("id") id: string, @Body() dto: UpdateHolidayDto) {
        return this.holidaysService.update(id, dto);
    }

    @Delete(":id")
    @Roles(["admin", "superadmin"])
    remove(@Param("id") id: string) {
        return this.holidaysService.remove(id);
    }
}
