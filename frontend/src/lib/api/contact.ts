import { apiPrefix, apiURL } from "./base";

async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {}
    return `${fallback}: ${res.statusText}`;
}

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
