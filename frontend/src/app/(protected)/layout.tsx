import React from "react";
import { Protected } from "./protected";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <Protected>{children}</Protected>;
}
