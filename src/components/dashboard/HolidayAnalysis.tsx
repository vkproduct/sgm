import { useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { format, subDays, addDays, getYear } from 'date-fns';
import { ru } from 'date-fns/locale';

interface HolidayAnalysisProps {
    transactions: Transaction[];
}

interface HolidayStats {
    name: string;
    date: Date;
    revenue: number;
    orders: number;
    avgDailyRevenue: number;
    lift: number;
}

export function HolidayAnalysis({ transactions }: HolidayAnalysisProps) {
    const stats = useMemo(() => {
        if (transactions.length === 0) return [];

        // 1. Calculate average daily revenue (baseline)
        const dailyRevenue: Record<string, number> = {};
        let totalRevenue = 0;
        let minDate = new Date();
        let maxDate = new Date(0);

        transactions.forEach(t => {
            const dateStr = t.InvoiceDate.split(' ')[0];
            const amount = t.Quantity * t.UnitPrice;
            dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + amount;
            totalRevenue += amount;

            const date = new Date(t.InvoiceDate);
            if (date < minDate) minDate = date;
            if (date > maxDate) maxDate = date;
        });

        const totalDays = Object.keys(dailyRevenue).length || 1;
        const avgGlobalDailyRevenue = totalRevenue / totalDays;

        // 2. Define Holidays (dynamic year based on data)
        const dataYear = getYear(maxDate); // Assume data is mostly from one year or recent
        const holidays = [
            { name: 'Новый Год', month: 0, day: 1 },
            { name: 'День Влюбленных', month: 1, day: 14 },
            { name: '8 Марта', month: 2, day: 8 },
            { name: 'День Труда', month: 4, day: 1 },
            { name: 'День Знаний', month: 8, day: 1 },
            { name: 'Хэллоуин', month: 9, day: 31 },
            { name: 'Черная Пятница', month: 10, day: 29 }, // Approximate
            { name: 'Рождество', month: 11, day: 25 },
        ];

        // 3. Calculate stats for each holiday window (+/- 3 days)
        const holidayStats: HolidayStats[] = holidays.map(h => {
            const holidayDate = new Date(dataYear, h.month, h.day);
            const startDate = subDays(holidayDate, 3);
            const endDate = addDays(holidayDate, 3);

            let holidayRevenue = 0;
            let holidayOrders = 0;

            transactions.forEach(t => {
                const tDate = new Date(t.InvoiceDate);
                if (tDate >= startDate && tDate <= endDate) {
                    holidayRevenue += t.Quantity * t.UnitPrice;
                    holidayOrders += 1;
                }
            });

            // Calculate average daily revenue during this holiday period (7 days)
            const holidayDailyAvg = holidayRevenue / 7;
            const lift = avgGlobalDailyRevenue > 0
                ? ((holidayDailyAvg - avgGlobalDailyRevenue) / avgGlobalDailyRevenue) * 100
                : 0;

            return {
                name: h.name,
                date: holidayDate,
                revenue: Math.round(holidayRevenue),
                orders: holidayOrders,
                avgDailyRevenue: Math.round(holidayDailyAvg),
                lift: Math.round(lift)
            };
        }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue

        return holidayStats;
    }, [transactions]);

    const chartData = stats.map(s => ({
        name: s.name,
        'Выручка в праздники': s.revenue,
        'Прирост (%)': s.lift
    }));

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {stats.slice(0, 3).map((stat, i) => (
                    <Card key={stat.name} className={i === 0 ? "border-primary/50 bg-primary/5" : ""}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                {stat.name}
                                {stat.lift > 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                    <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                                )}
                            </CardTitle>
                            <CardDescription>{format(stat.date, 'd MMMM', { locale: ru })}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-1">${stat.revenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mb-4">
                                Выручка за неделю (+/- 3 дня)
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-muted-foreground">
                                    <ShoppingBag className="w-4 h-4 mr-1" />
                                    {stat.orders} заказов
                                </div>
                                <div className={`font-medium ${stat.lift >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.lift > 0 ? '+' : ''}{stat.lift}% к среднему
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Влияние праздников на выручку</CardTitle>
                        <CardDescription>Сравнение общей выручки в праздничные периоды</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    formatter={(value) => [`$${value}`, 'Выручка']}
                                />
                                <Bar dataKey="Выручка в праздники" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Эффективность праздников (Lift)</CardTitle>
                        <CardDescription>Процент прироста продаж относительно обычных дней</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    formatter={(value) => [`${value}%`, 'Прирост']}
                                />
                                <Bar dataKey="Прирост (%)">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry['Прирост (%)'] >= 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
