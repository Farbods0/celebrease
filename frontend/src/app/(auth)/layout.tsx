import React from "react";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                overflowY: "auto",
            }}
        >
            {children}
        </div>
    );
}
