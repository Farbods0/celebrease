import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    name?: string;

    @IsOptional()
    @IsIn(["admin", "user"])
    role?: string;

    @IsOptional()
    @IsString()
    @MaxLength(32)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    region?: string;
}
