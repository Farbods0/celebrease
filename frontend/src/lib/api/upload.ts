export const baseURL = "";
export const apiPrefix = "/api/v1";

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseURL}${apiPrefix}/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Upload failed"));
    }

    const { url } = await response.json();
    return url;
}

export async function deleteImage(url: string): Promise<void> {
    const response = await fetch(`${baseURL}${apiPrefix}/upload/image?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Delete failed"));
    }
}

async function readError(response: Response, fallback: string): Promise<string> {
    try {
        const body = await response.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {
        // body wasn't JSON
    }
    return `${fallback}: ${response.statusText}`;
}
