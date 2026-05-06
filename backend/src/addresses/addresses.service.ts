import { UpsertAddressDto } from "@/addresses/dto/upsert-address.dto";
import { PrismaService } from "@/common/services/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class AddressesService {
    constructor(private readonly prisma: PrismaService) {}

    async getMine(userId: string) {
        const address = await this.prisma.address.findUnique({ where: { userId } });
        if (!address) throw new NotFoundException("Address not found");

        return address;
    }

    async upsertMine(userId: string, dto: UpsertAddressDto) {
        const address = await this.prisma.address.upsert({
            where: { userId },
            create: { userId, ...dto },
            update: dto,
        });
        if (!address) throw new NotFoundException("Failed to save address");

        return address;
    }
}
