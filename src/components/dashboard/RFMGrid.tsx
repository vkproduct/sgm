import React, { useMemo } from 'react';
import { Customer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RFMGridProps {
    customers: Customer[];
}

export function RFMGrid({ customers }: RFMGridProps) {
    const segments = useMemo(() => {
        const segmentCounts: Record<string, { count: number; totalMonetary: number }> = {};

        customers.forEach(c => {
            if (!segmentCounts[c.segment]) {
                segmentCounts[c.segment] = { count: 0, totalMonetary: 0 };
            }
            segmentCounts[c.segment].count++;
            segmentCounts[c.segment].totalMonetary += c.monetary;
        });

        return segmentCounts;
    }, [customers]);

    const totalCustomers = customers.length;

    const getSegmentColor = (segment: string) => {
        switch (segment) {
            case 'Champions': return 'bg-emerald-500 text-white';
            case 'Loyal Customers': return 'bg-emerald-400 text-white';
            case 'Potential Loyalists': return 'bg-emerald-300 text-emerald-900';
            case 'Promising': return 'bg-yellow-300 text-yellow-900';
            case 'Needs Attention': return 'bg-yellow-400 text-yellow-900';
            case 'At Risk': return 'bg-orange-400 text-white';
            case 'Can\'t Lose Them': return 'bg-orange-300 text-orange-900';
            case 'Hibernating': return 'bg-red-300 text-red-900';
            case 'Lost': return 'bg-red-500 text-white';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    // Better Grid Mapping based on R (rows) and F (cols)
    // R (y-axis): 5 (top) -> 1 (bottom)
    // F (x-axis): 1 (left) -> 5 (right)

    // Aggregate by R and F scores
    const matrixData = useMemo(() => {
        const data = Array(5).fill(null).map(() => Array(5).fill({ count: 0, label: '' }));

        // Initialize with labels
        // This is a simplification. Ideally we map each cell to a segment name.

        customers.forEach(c => {
            // R and F are 1-5. Array indices are 0-4.
            // We want R=5 at top (row 0), R=1 at bottom (row 4)
            const rowIndex = 5 - c.r_score;
            const colIndex = c.f_score - 1;

            if (rowIndex >= 0 && rowIndex < 5 && colIndex >= 0 && colIndex < 5) {
                const current = data[rowIndex][colIndex];
                data[rowIndex][colIndex] = {
                    ...current,
                    count: current.count + 1,
                    label: c.segment // This might overwrite, but usually cells map to one segment
                };
            }
        });
        return data;
    }, [customers]);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>RFM Segmentation Grid</CardTitle>
                        <CardDescription>
                            Distribution of customers based on Recency (R) and Frequency (F).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            {/* Y-Axis Label */}
                            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground">
                                Recency (High → Low)
                            </div>

                            <div className="grid grid-cols-5 gap-2 aspect-square max-w-md mx-auto">
                                {matrixData.map((row, i) => (
                                    <React.Fragment key={i}>
                                        {row.map((cell, j) => {
                                            const percentage = ((cell.count / totalCustomers) * 100).toFixed(1);
                                            const intensity = Math.min(cell.count / (totalCustomers * 0.1), 1); // Cap opacity at 10% of total

                                            return (
                                                <div
                                                    key={`${i}-${j}`}
                                                    className={cn(
                                                        "rounded-md flex flex-col items-center justify-center text-xs p-1 transition-all hover:scale-105 cursor-pointer border",
                                                        cell.count > 0 ? "border-primary/20" : "border-transparent bg-muted/20"
                                                    )}
                                                    style={{
                                                        backgroundColor: cell.count > 0 ? `rgba(99, 102, 241, ${0.1 + intensity * 0.9})` : undefined,
                                                        color: cell.count > 0 ? 'white' : undefined
                                                    }}
                                                    title={`${cell.label}: ${cell.count} customers`}
                                                >
                                                    <span className="font-bold">{cell.count}</span>
                                                    <span className="scale-75 opacity-80">{percentage}%</span>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* X-Axis Label */}
                            <div className="text-center mt-4 text-sm font-medium text-muted-foreground">
                                Frequency (Low → High)
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Segment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(segments)
                                .sort(([, a], [, b]) => b.count - a.count)
                                .map(([name, data]) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className={cn("w-3 h-3 rounded-full", getSegmentColor(name))} />
                                            <span className="text-sm font-medium">{name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{data.count}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {((data.count / totalCustomers) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
