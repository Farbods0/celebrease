import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { month: "Jan", subscriptions: 6000, rentals: 18000 },
    { month: "Feb", subscriptions: 7200, rentals: 20500 },
    { month: "Mar", subscriptions: 6800, rentals: 19800 },
    { month: "Apr", subscriptions: 7800, rentals: 21000 },
    { month: "May", subscriptions: 7300, rentals: 19500 },
    { month: "Jun", subscriptions: 8100, rentals: 20800 },
    { month: "Jul", subscriptions: 7600, rentals: 19900 },
    { month: "Aug", subscriptions: 8200, rentals: 21200 },
    { month: "Sep", subscriptions: 7900, rentals: 20500 },
    { month: "Oct", subscriptions: 8600, rentals: 22000 },
    { month: "Nov", subscriptions: 8400, rentals: 21600 },
    { month: "Dec", subscriptions: 8900, rentals: 22800 },
];

const formatK = (value: number) => (value === 0 ? "0" : `${Math.round(value / 1000)}k`);

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1 text-xs">
            <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-foreground">{label}</span>
        </div>
    );
}

export function RevenueTrendsChart() {
    return (
        <div className="rounded-lg border bg-card p-5 shadow-none">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="text-xl font-medium text-foreground">Revenue Trends</h3>
                <div className="flex items-center gap-2">
                    <LegendDot color="var(--chart-1)" label="Subscriptions" />
                    <LegendDot color="var(--chart-2)" label="Rentals" />
                    <select className="rounded-md border bg-card py-1 px-2 shadow-none text-xs">
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
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
                            domain={[0, 25000]}
                            ticks={[0, 5000, 10000, 15000, 20000, 25000]}
                        />
                        <Tooltip
                            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                            contentStyle={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            formatter={(value: number, name: string) => [
                                `$${value.toLocaleString()}`,
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
