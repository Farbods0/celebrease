import { NewsletterDto } from "@/common/dto/newsletter.dto";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller("newsletter")
export class NewsletterController {
    private readonly brevoUrl = "https://api.brevo.com/v3/contacts";

    constructor(private readonly configService: ConfigService) {}

    private getBrevoListId() {
        const listId = this.configService.get<number>("brevo.listId");

        if (!listId || !Number.isInteger(Number(listId))) {
            throw new BadRequestException("BREVO_LIST_ID must be a positive number");
        }

        return Number(listId);
    }

    @Post("subscribe")
    @AllowAnonymous()
    async subscribe(@Body() body: NewsletterDto) {
        const apiKey = this.configService.get<string>("brevo.apiKey");

        if (!apiKey) {
            throw new BadRequestException("BREVO_API_KEY is missing");
        }

        const response = await fetch(this.brevoUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify({
                email: body.email,
                listIds: [this.getBrevoListId()],
                updateEnabled: true,
            }),
        });

        const data = (await response.json()) as { message?: string };

        if (!response.ok) {
            throw new BadRequestException(data?.message ?? "Failed to subscribe email");
        }

        return { success: true };
    }
}
