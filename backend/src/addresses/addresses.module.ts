import { AddressesController } from "@/addresses/addresses.controller";
import { AddressesService } from "@/addresses/addresses.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [AddressesController],
    providers: [AddressesService],
    exports: [AddressesService],
})
export class AddressesModule {}
