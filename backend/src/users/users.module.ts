import { UsersController } from "@/users/users.controller";
import { UsersService } from "@/users/users.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
