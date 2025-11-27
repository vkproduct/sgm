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
            'VIP Customers': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#8b5cf6' },
            'Regular Buyers': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#3b82f6' },
            'Occasional Shoppers': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#10b981' },
            'New Low Spenders': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#f59e0b' },
            'Sleeping Shoppers': { count: 0, monetary: 0, frequency: 0, recency: 0, color: '#64748b' }
        };

        customers.forEach(c => {
            let cluster = 'Occasional Shoppers';

            if (c.monetary > 2000) cluster = 'VIP Customers';
            else if (c.frequency > 10) cluster = 'Regular Buyers';
            else if (c.recency < 30 && c.frequency <= 2) cluster = 'New Low Spenders';
            else if (c.recency > 90) cluster = 'Sleeping Shoppers';

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
                                    <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Avg Value</span>
                                    <span className="font-medium">${cluster.avgValue}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center"><ShoppingBag className="w-3 h-3 mr-1" /> Freq</span>
                                    <span className="font-medium">{cluster.avgFreq}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Days Ago</span>
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
                        <CardTitle>Cluster Size Comparison</CardTitle>
                        <CardDescription>Number of customers in each cluster</CardDescription>
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
                        <CardTitle>Average Value by Cluster</CardTitle>
                        <CardDescription>Average lifetime value per customer</CardDescription>
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
                                    formatter={(value) => [`$${value}`, 'Avg Value']}
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
