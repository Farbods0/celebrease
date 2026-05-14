import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ContactDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    lastName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    subject!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    message!: string;
}
