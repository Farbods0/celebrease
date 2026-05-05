import { IsNotEmpty, IsString } from "class-validator";

export class AddHolidayAddOnDto {
    @IsString()
    @IsNotEmpty()
    addOnId: string;
}
