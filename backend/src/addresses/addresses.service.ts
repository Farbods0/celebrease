import { UpsertAddressDto } from "@/addresses/dto/upsert-address.dto";
import { PrismaService } from "@/common/services/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AddressesService {
    constructor(private readonly prisma: PrismaService) {}

    getMine(userId: string) {
        return this.prisma.address.findUnique({ where: { userId } });
    }

    upsertMine(userId: string, dto: UpsertAddressDto) {
        return this.prisma.address.upsert({
            where: { userId },
            create: { userId, ...dto },
            update: dto,
        });
    }
}
