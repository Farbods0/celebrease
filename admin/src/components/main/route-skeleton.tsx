export function RouteSkeleton() {
    return (
        <div className="content">
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", opacity: 0.5 }}>
                <div style={{ height: "60px", background: "var(--card)", borderRadius: "var(--radius)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ height: "80px", background: "var(--card)", borderRadius: "var(--radius-sm)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                    ))}
                </div>
                <div style={{ height: "400px", background: "var(--card)", borderRadius: "var(--radius)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </div>
    );
}
