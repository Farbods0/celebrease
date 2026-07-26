import { AdminUpdateSubscriptionDto, AssignHolidaySlotDto } from "@/subscriptions/dto/admin-update.dto";
import { CreateCheckoutDto } from "@/subscriptions/dto/checkout.dto";
import { SubscriptionsService } from "@/subscriptions/subscriptions.service";
import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("/subscription")
export class SubscriptionsController {
    constructor(private readonly subscriptions: SubscriptionsService) {}

    @Get("/me")
    getMine(@Session() session: UserSession) {
        return this.subscriptions.getMine(session);
    }

    @Get("/payment-method")
    getPaymentMethod(@Session() session: UserSession) {
        return this.subscriptions.getPaymentMethod(session);
    }

    @Get("/admin")
    @Roles(["admin", "superadmin"])
    listAll() {
        return this.subscriptions.listAll();
    }

    @Get("/admin/:id")
    @Roles(["admin", "superadmin"])
    getById(@Param("id") id: string) {
        return this.subscriptions.getById(id);
    }

    @Patch("/admin/:id/status")
    @Roles(["admin", "superadmin"])
    adminUpdateStatus(@Param("id") id: string, @Body() dto: AdminUpdateSubscriptionDto) {
        if (!dto.status) throw new BadRequestException("status is required");
        return this.subscriptions.adminUpdateStatus(id, dto.status);
    }

    @Patch("/admin/:id/slots/:slotId")
    @Roles(["admin", "superadmin"])
    assignHolidaySlot(@Param("id") id: string, @Param("slotId") slotId: string, @Body() dto: AssignHolidaySlotDto) {
        return this.subscriptions.assignHolidaySlot(id, slotId, dto.holidayId);
    }

    @Post("/slots/:slotId/assign")
    assignMyHolidaySlot(@Param("slotId") slotId: string, @Body() dto: AssignHolidaySlotDto, @Session() session: UserSession) {
        return this.subscriptions.assignMyHolidaySlot(session, slotId, dto.holidayId);
    }

    @Post("/checkout")
    createCheckout(@Body() dto: CreateCheckoutDto, @Session() session: UserSession) {
        return this.subscriptions.createCheckout(dto, session);
    }
}
