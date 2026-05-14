import { ContactDto } from "@/common/dto/contact.dto";
import { EmailService } from "@/common/services/email.service";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller("contact")
export class ContactController {
    constructor(private readonly emailService: EmailService) {}

    @Post()
    @AllowAnonymous()
    @HttpCode(HttpStatus.OK)
    async submit(@Body() dto: ContactDto) {
        await this.emailService.contact({
            name: `${dto.firstName} ${dto.lastName}`,
            email: dto.email,
            subject: dto.subject,
            message: dto.message,
        });
        return { success: true };
    }
}
