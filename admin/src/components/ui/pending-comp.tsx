export function PendingComp() {
    return (
        <div className="flex-1 flex flex-col gap-6 p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-40 bg-muted rounded-lg" />
                    <div className="h-4 w-64 bg-muted/60 rounded-md" />
                </div>
                <div className="h-9 w-28 bg-muted rounded-lg" />
            </div>

            {/* Stat cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="h-4 w-24 bg-muted rounded-md" />
                            <div className="size-9 bg-muted rounded-lg" />
                        </div>
                        <div className="h-8 w-16 bg-muted rounded-lg" />
                        <div className="h-3 w-28 bg-muted/60 rounded-md" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="border-b bg-muted/40 h-10 flex items-center gap-4 px-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-3 bg-muted rounded-md" style={{ width: `${60 + i * 15}px` }} />
                    ))}
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-b last:border-b-0 h-14 flex items-center gap-4 px-4">
                        <div className="size-9 bg-muted rounded-lg shrink-0" />
                        <div className="h-4 w-36 bg-muted/70 rounded-md" />
                        <div className="h-3 w-24 bg-muted/50 rounded-md" />
                        <div className="h-3 w-20 bg-muted/50 rounded-md" />
                        <div className="h-5 w-16 bg-muted/60 rounded-full ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
