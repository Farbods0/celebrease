import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const holidays = [
    { name: "Christmas", value: 45, color: "var(--chart-2)" },
    { name: "Diwali", value: 20, color: "var(--chart-3)" },
    { name: "Halloween", value: 15, color: "var(--chart-1)" },
    { name: "Valentine", value: 12, color: "var(--chart-5)" },
    { name: "Others", value: 8, color: "var(--chart-4)" },
];

export function HolidayDistributionChart() {
    return (
        <div className="flex h-full flex-col rounded-lg border bg-card p-5 shadow-none">
            <h3 className="text-xl font-medium text-foreground">Holiday Distribution</h3>

            <div className="mt-2 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            formatter={(value: number, name: string) => [`${value}%`, name]}
                        />
                        <Pie
                            data={holidays}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={2}
                            stroke="var(--card)"
                            strokeWidth={2}
                        >
                            {holidays.map((h) => (
                                <Cell key={h.name} fill={h.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <ul className="mt-3 flex flex-col gap-1">
                {holidays.map((h) => (
                    <li key={h.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: h.color }} />
                            <span className="text-foreground">{h.name}</span>
                        </div>
                        <span className="font-medium text-muted-foreground tabular-nums">{h.value}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
