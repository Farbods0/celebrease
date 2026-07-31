import { apiPrefix, apiURL, readError } from "./base";



export async function submitContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}): Promise<{ success: boolean }> {
    const res = await fetch(apiURL(`${apiPrefix}/contact`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to submit contact form"));
    }

    return res.json();
}
