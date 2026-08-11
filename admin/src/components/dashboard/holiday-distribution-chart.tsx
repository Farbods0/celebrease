import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["var(--chart-2)", "var(--chart-3)", "var(--chart-1)", "var(--chart-5)", "var(--chart-4)"];

type Props = {
    data: { name: string; value: number }[];
};

export function HolidayDistributionChart({ data }: Props) {
    const palette = data.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));

    return (
        <div className="flex h-full flex-col rounded-lg border bg-card p-5 shadow-none">
            <h3 className="text-xl font-medium text-foreground">Holiday Distribution</h3>

            <div className="mt-2 w-full">
                {palette.length === 0 ? (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No order data</div>
                ) : (
                    <ResponsiveContainer width="100%" height={192} minWidth={1}>
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    background: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                                formatter={(value: any, name: any) => [`${value}%`, name as string]}
                            />
                            <Pie
                                data={palette}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={2}
                                stroke="var(--card)"
                                strokeWidth={2}
                            >
                                {palette.map((h) => (
                                    <Cell key={h.name} fill={h.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            <ul className="mt-3 flex flex-col gap-1">
                {palette.map((h) => (
                    <li key={h.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-sm" style={{ background: h.color }} />
                            <span className="text-foreground">{h.name}</span>
                        </div>
                        <span className="font-medium text-muted-foreground tabular-nums">{h.value}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
