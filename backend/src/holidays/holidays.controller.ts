import { CreateHolidayDto } from "@/holidays/dto/create-holiday.dto";
import { AddHolidayAddOnDto } from "@/holidays/dto/holiday-addon.dto";
import { UpdateHolidayDto } from "@/holidays/dto/update-holiday.dto";
import { HolidaysService } from "@/holidays/holidays.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AllowAnonymous, Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth";

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

    @Get("loves")
    @AllowAnonymous()
    listByLoves() {
        return this.holidaysService.listByLoves();
    }

    @Get("me/loves")
    listMyLoves(@Session() session: UserSession) {
        return this.holidaysService.listMyLoves(session.user.id);
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

    @Post(":id/addons")
    @Roles(["admin", "superadmin"])
    addAddOn(@Param("id") id: string, @Body() dto: AddHolidayAddOnDto) {
        return this.holidaysService.addAddOn(id, dto);
    }

    @Delete(":id/addons/:addOnId")
    @Roles(["admin", "superadmin"])
    removeAddOn(@Param("id") id: string, @Param("addOnId") addOnId: string) {
        return this.holidaysService.removeAddOn(id, addOnId);
    }

    @Post(":id/love")
    love(@Param("id") id: string, @Session() session: UserSession) {
        return this.holidaysService.love(id, session.user.id);
    }

    @Delete(":id/love")
    unlove(@Param("id") id: string, @Session() session: UserSession) {
        return this.holidaysService.unlove(id, session.user.id);
    }
}
