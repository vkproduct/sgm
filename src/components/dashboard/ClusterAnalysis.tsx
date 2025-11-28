import { useMemo } from 'react';
import { Customer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Clock } from 'lucide-react';

interface ClusterAnalysisProps {
    customers: Customer[];
}

export function ClusterAnalysis({ customers }: ClusterAnalysisProps) {
    const clusters = useMemo(() => {
        // Define clusters based on simple rules for MVP
        // VIP: High Monetary
        // Regular: High Frequency, Moderate Monetary
        // Occasional: Moderate Frequency
        // New: Low Recency (recent), Low Frequency
        // Sleeping: High Recency (old), Low Frequency

        const data = {
            'VIP клиенты': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#8b5cf6' },
            'Постоянные покупатели': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#3b82f6' },
            'Случайные покупатели': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#10b981' },
            'Новые с низкими тратами': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#f59e0b' },
            'Спящие покупатели': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#64748b' }
        };

        customers.forEach(c => {
            let cluster = 'Случайные покупатели';

            if (c.monetary > 2000) cluster = 'VIP клиенты';
            else if (c.frequency > 10) cluster = 'Постоянные покупатели';
            else if (c.recency < 30 && c.frequency <= 2) cluster = 'Новые с низкими тратами';
            else if (c.recency > 90) cluster = 'Спящие покупатели';

            data[cluster as keyof typeof data].count++;
            data[cluster as keyof typeof data].monetary += c.monetary;
            data[cluster as keyof typeof data].frequency += c.frequency;
            data[cluster as keyof typeof data].recency += c.recency;
        });

        return Object.entries(data).map(([name, stats]) => ({
            name,
            count: stats.count,
            avgValue: stats.count ? Math.round(stats.monetary / stats.count) : 0,
            avgFreq: stats.count ? (stats.frequency / stats.count).toFixed(1) : 0,
            avgRecency: stats.count ? Math.round(stats.recency / stats.count) : 0,
            color: stats.color
        }));
    }, [customers]);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
                {clusters.map((cluster) => (
                    <Card key={cluster.name} className="border-t-4" style={{ borderTopColor: cluster.color }}>
                        <CardContent className="p-4">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                {cluster.name}
                            </div>
                            <div className="text-2xl font-bold mb-2">{cluster.count}</div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Ср. чек</span>
                                    <span className="font-medium">${cluster.avgValue}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center"><ShoppingBag className="w-3 h-3 mr-1" /> Частота</span>
                                    <span className="font-medium">{cluster.avgFreq}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Дней назад</span>
                                    <span className="font-medium">{cluster.avgRecency}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Сравнение размеров кластеров</CardTitle>
                        <CardDescription>Количество клиентов в каждом кластере</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clusters} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {clusters.map((entry: typeof clusters[number], index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Средний чек по кластерам</CardTitle>
                        <CardDescription>Средняя сумма покупок на клиента</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clusters}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value) => [`$${value}`, 'Средний чек']}
                                />
                                <Bar dataKey="avgValue" radius={[4, 4, 0, 0]}>
                                    {clusters.map((entry: typeof clusters[number], index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
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
