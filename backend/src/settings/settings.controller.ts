import { Body, Controller, Get, Patch } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { SettingsService } from "./settings.service";

@Controller("settings")
@Roles(["admin", "superadmin"])
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    get() {
        return this.settingsService.get();
    }

    @Get("public")
    @AllowAnonymous()
    getPublic() {
        return this.settingsService.getPublic();
    }

    @Patch()
    update(@Body() dto: UpdateSettingsDto) {
        return this.settingsService.update(dto);
    }

    @Get("stripe-status")
    stripeStatus() {
        const key = process.env.STRIPE_SECRET_KEY ?? "";
        const mode = key.startsWith("sk_live_") ? "live" : key.startsWith("sk_test_") ? "test" : "unknown";
        return { mode };
    }
}
