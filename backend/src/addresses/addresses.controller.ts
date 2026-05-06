import { AddressesService } from "@/addresses/addresses.service";
import { UpsertAddressDto } from "@/addresses/dto/upsert-address.dto";
import { Body, Controller, Get, Patch } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("/address")
export class AddressesController {
    constructor(private readonly addresses: AddressesService) {}

    @Get("/me")
    getMine(@Session() session: UserSession) {
        return this.addresses.getMine(session.user.id);
    }

    @Patch("/me")
    upsertMine(@Body() dto: UpsertAddressDto, @Session() session: UserSession) {
        return this.addresses.upsertMine(session.user.id, dto);
    }
}
