import { apiPrefix, apiURL, readError } from "./base";



export async function subscribeNewsletter(data: { email: string }): Promise<{ success: boolean }> {
    const res = await fetch(apiURL(`${apiPrefix}/newsletter/subscribe`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to subscribe to newsletter"));
    }

    return res.json();
}