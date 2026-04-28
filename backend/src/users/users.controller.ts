import { CreateUserDto } from "@/users/dto/create-user.dto";
import { ListUsersDto } from "@/users/dto/list-users.dto";
import { UpdateUserDto } from "@/users/dto/update-user.dto";
import { UsersService } from "@/users/users.service";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import type { UserSession } from "@thallesp/nestjs-better-auth";
import { Roles, Session } from "@thallesp/nestjs-better-auth";

@Controller("/user")
@Roles(["admin", "superadmin"])
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    list(@Query() query: ListUsersDto, @Session() session: UserSession) {
        return this.usersService.list(query, session);
    }

    @Get(":id")
    get(@Param("id") id: string) {
        return this.usersService.getById(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }
}
