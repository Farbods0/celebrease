import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
    data: { month: string; subscriptions: number; rentals: number }[];
};

const formatK = (value: number) => (value === 0 ? "0" : `${Math.round(value / 1000)}k`);

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1 text-xs">
            <span className="size-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-foreground">{label}</span>
        </div>
    );
}

export function RevenueTrendsChart({ data }: Props) {
    const max = data.reduce((acc, d) => Math.max(acc, d.subscriptions, d.rentals), 0);
    // Round the upper bound up to the next 5k so ticks stay clean.
    const upper = Math.max(5000, Math.ceil((max * 1.1) / 5000) * 5000);
    const ticks: number[] = [];
    for (let v = 0; v <= upper; v += upper / 5) ticks.push(v);

    return (
        <div className="rounded-lg border bg-card p-5 shadow-none">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="text-xl font-medium text-foreground">Revenue Trends</h3>
                <div className="flex items-center gap-2">
                    <LegendDot color="var(--chart-1)" label="Subscriptions" />
                    <LegendDot color="var(--chart-2)" label="Rentals" />
                </div>
            </div>

            <div className="mt-4 w-full">
                <ResponsiveContainer width="100%" height={256} minWidth={1}>
                    <LineChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={6} />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            fontSize={11}
                            tickFormatter={formatK}
                            tickLine={false}
                            axisLine={false}
                            width={48}
                            domain={[0, upper]}
                            ticks={ticks}
                        />
                        <Tooltip
                            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                            contentStyle={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            formatter={(value: any, name: any) => [
                                `$${(value || 0).toLocaleString()}`,
                                name === "subscriptions" ? "Subscriptions" : "Rentals",
                            ]}
                            labelStyle={{ color: "var(--muted-foreground)" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="subscriptions"
                            stroke="var(--chart-1)"
                            strokeWidth={2.25}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rentals"
                            stroke="var(--chart-2)"
                            strokeWidth={2.25}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
