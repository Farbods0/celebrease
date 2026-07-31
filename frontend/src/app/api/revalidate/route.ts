import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== "celebrease-revalidate-2026") {
        return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const path = request.nextUrl.searchParams.get("path") || "/";

    revalidatePath(path, "page");

    return NextResponse.json({ revalidated: true, path, now: Date.now() });
}
