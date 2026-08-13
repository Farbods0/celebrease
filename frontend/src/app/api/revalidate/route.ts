import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== "celebrease-revalidate-2026") {
        return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const path = request.nextUrl.searchParams.get("path") || "/";
    const tag = request.nextUrl.searchParams.get("tag");

    if (tag) {
        revalidateTag(tag);
    }
    revalidatePath(path, "page");

    return NextResponse.json({ revalidated: true, path, tag, now: Date.now() });
}
