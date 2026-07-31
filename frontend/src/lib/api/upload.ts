import { apiPrefix, apiURL, readError } from "./base";

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(apiURL(`${apiPrefix}/upload/image`), {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Upload failed"));
    }

    const { url } = await response.json();
    return url;
}

export async function deleteImage(url: string): Promise<void> {
    const response = await fetch(apiURL(`${apiPrefix}/upload/image?url=${encodeURIComponent(url)}`), {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Delete failed"));
    }
}


