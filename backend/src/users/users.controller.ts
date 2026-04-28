import { CreateUserDto } from "@/users/dto/create-user.dto";
import { ListUsersDto } from "@/users/dto/list-users.dto";
import { UpdateUserDto } from "@/users/dto/update-user.dto";
import { UsersService } from "@/users/users.service";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Roles } from "@thallesp/nestjs-better-auth";

@Controller("/user")
@Roles(["admin"])
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    list(@Query() query: ListUsersDto) {
        return this.usersService.list(query);
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
