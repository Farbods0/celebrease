import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsIn(["admin", "user"])
    role?: string = "user";

    @IsOptional()
    @IsString()
    @MaxLength(32)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    region?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    password: string;
}
