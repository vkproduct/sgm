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

    const getSegmentDescription = (segment: string): string => {
        const descriptions: Record<string, string> = {
            'Champions': 'Ваши лучшие клиенты! Покупают часто и недавно, тратят больше всех. Награждайте их эксклюзивными предложениями и ранним доступом к новинкам.',
            'Loyal Customers': 'Постоянные покупатели с высокой частотой покупок. Поощряйте их программами лояльности и персональными скидками.',
            'Potential Loyalists': 'Недавние покупатели с хорошим потенциалом. Предложите членство в программе лояльности и персонализированные рекомендации.',
            'Promising': 'Новые клиенты, которые недавно совершили покупку. Вовлекайте их с помощью онбординга и специальных предложений для новичков.',
            'Needs Attention': 'Клиенты с умеренной активностью. Отправьте персонализированные предложения на основе их истории покупок.',
            'At Risk': 'Раньше покупали часто, но давно не возвращались. Срочно отправьте win-back кампанию с привлекательным предложением.',
            'Can\'t Lose Them': 'Ценные клиенты, которые перестали покупать. Свяжитесь лично, узнайте причину и предложите VIP-условия возврата.',
            'Hibernating': 'Давно не покупали, низкая частота. Попробуйте реактивировать через опрос с бонусом или напоминание о бренде.',
            'Lost': 'Потерянные клиенты. Последняя попытка - агрессивная скидка или новое ценностное предложение. Если не сработает - исключите из активных кампаний.',
        };
        return descriptions[segment] || 'Сегмент требует дополнительного анализа.';
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
            {/* Explanation Card */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Что такое RFM сегментация?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700">
                        <strong>RFM анализ</strong> — это метод сегментации клиентов на основе трёх ключевых показателей:
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="font-bold text-purple-700 mb-1">R — Recency (Давность)</div>
                            <div className="text-xs text-gray-600">Как давно клиент совершил последнюю покупку. Чем меньше дней прошло — тем выше балл.</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                            <div className="font-bold text-blue-700 mb-1">F — Frequency (Частота)</div>
                            <div className="text-xs text-gray-600">Как часто клиент покупает. Чем больше заказов — тем выше балл.</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                            <div className="font-bold text-green-700 mb-1">M — Monetary (Деньги)</div>
                            <div className="text-xs text-gray-600">Сколько денег клиент потратил. Чем больше сумма — тем выше балл.</div>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 mt-3">
                        <p className="text-sm text-gray-700">
                            <strong>Как читать сетку:</strong> Каждая ячейка показывает количество клиентов с определённой комбинацией R и F баллов (от 1 до 5).
                            Чем интенсивнее цвет — тем больше клиентов в этой ячейке. Наведите курсор на ячейку, чтобы увидеть название сегмента.
                        </p>
                    </div>
                </CardContent>
            </Card>

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
                                            const intensity = Math.min(cell.count / (totalCustomers * 0.1), 1);
                                            const rScore = 5 - i; // R score from 5 (top) to 1 (bottom)
                                            const fScore = j + 1; // F score from 1 (left) to 5 (right)

                                            const tooltipText = cell.count > 0
                                                ? `${cell.label}\n\nR=${rScore} (Давность), F=${fScore} (Частота)\n${cell.count} клиентов (${percentage}%)\n\n${getSegmentDescription(cell.label)}`
                                                : `R=${rScore}, F=${fScore}\nНет клиентов`;

                                            return (
                                                <div
                                                    key={`${i}-${j}`}
                                                    className={cn(
                                                        "rounded-md flex flex-col items-center justify-center text-xs p-1 transition-all hover:scale-105 cursor-pointer border relative group",
                                                        cell.count > 0 ? "border-primary/20" : "border-transparent bg-muted/20"
                                                    )}
                                                    style={{
                                                        backgroundColor: cell.count > 0 ? `rgba(99, 102, 241, ${0.1 + intensity * 0.9})` : undefined,
                                                        color: cell.count > 0 ? 'white' : undefined
                                                    }}
                                                    title={tooltipText}
                                                >
                                                    <span className="font-bold">{cell.count}</span>
                                                    <span className="scale-75 opacity-80">{percentage}%</span>

                                                    {/* Enhanced tooltip on hover */}
                                                    {cell.count > 0 && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64 pointer-events-none">
                                                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                                                                <div className="font-bold mb-1">{cell.label}</div>
                                                                <div className="text-gray-300 mb-2">
                                                                    R={rScore} (Давность) • F={fScore} (Частота)
                                                                </div>
                                                                <div className="text-gray-300 mb-2">
                                                                    {cell.count} клиентов ({percentage}%)
                                                                </div>
                                                                <div className="text-gray-400 text-xs leading-relaxed border-t border-gray-700 pt-2">
                                                                    {getSegmentDescription(cell.label)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
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
                        <CardTitle>Описание сегментов</CardTitle>
                        <CardDescription>Характеристики и рекомендации</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {Object.entries(segments)
                                .sort(([, a], [, b]) => b.count - a.count)
                                .map(([name, data]) => (
                                    <div key={name} className="border-l-4 pl-3 py-2" style={{ borderColor: getSegmentColor(name).includes('emerald') ? '#10b981' : getSegmentColor(name).includes('yellow') ? '#f59e0b' : getSegmentColor(name).includes('orange') ? '#f97316' : '#ef4444' }}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center space-x-2">
                                                <div className={cn("w-3 h-3 rounded-full", getSegmentColor(name))} />
                                                <span className="text-sm font-bold">{name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold">{data.count}</span>
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    ({((data.count / totalCustomers) * 100).toFixed(1)}%)
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {getSegmentDescription(name)}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
