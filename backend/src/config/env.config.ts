export const config = () => ({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 4000,
    appName: process.env.APP_NAME,
    apiPrefix: process.env.API_PREFIX,
    appVersion: process.env.APP_VERSION,
    client: process.env.CLIENT,

    databaseUrl: process.env.DATABASE_URL,

    betterAuth: {
        secret: process.env.BETTER_AUTH_SECRET,
        url: process.env.BETTER_AUTH_URL,
    },

    mail: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },

    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        successUrl: process.env.STRIPE_SUCCESS_URL,
        cancelUrl: process.env.STRIPE_CANCEL_URL,
    },

    brevo: {
        apiKey: process.env.BREVO_API_KEY,
        listId: process.env.BREVO_LIST_ID,
    },
});
