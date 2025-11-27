import { useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseISO, getDay, getHours } from 'date-fns';

interface TemporalTrendsProps {
    transactions: Transaction[];
}

export function TemporalTrends({ transactions }: TemporalTrendsProps) {
    const monthlySales = useMemo(() => {
        const sales: Record<string, number> = {};
        transactions.forEach(t => {
            const date = t.InvoiceDate.substring(0, 7); // YYYY-MM
            sales[date] = (sales[date] || 0) + (t.Quantity * t.UnitPrice);
        });

        return Object.entries(sales)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, amount]) => ({
                date,
                amount: Math.round(amount)
            }));
    }, [transactions]);

    const dayOfWeekSales = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const sales = Array(7).fill(0);

        transactions.forEach(t => {
            const date = parseISO(t.InvoiceDate);
            const day = getDay(date);
            sales[day] += (t.Quantity * t.UnitPrice);
        });

        return days.map((day, i) => ({
            day,
            amount: Math.round(sales[i])
        }));
    }, [transactions]);

    const hourlyHeatmap = useMemo(() => {
        const hours = Array(24).fill(0);

        transactions.forEach(t => {
            const date = parseISO(t.InvoiceDate);
            const hour = getHours(date);
            hours[hour] += (t.Quantity * t.UnitPrice);
        });

        return hours.map((amount, hour) => ({
            hour: `${hour}:00`,
            amount: Math.round(amount)
        }));
    }, [transactions]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Sales Trends</CardTitle>
                    <CardDescription>Revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(value) => [`$${value}`, 'Revenue']}
                            />
                            <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Day of Week</CardTitle>
                        <CardDescription>Which days are busiest?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dayOfWeekSales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Peak Shopping Hours</CardTitle>
                        <CardDescription>Sales distribution by hour of day</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyHeatmap}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="hour" interval={3} />
                                <YAxis tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                />
                                <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
