import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface ColumnMapperProps {
    headers: string[];
    previewData: any[];
    onConfirm: (mapping: Record<string, string>) => void;
    onCancel: () => void;
}

export type RequiredField = 'CustomerID' | 'InvoiceDate' | 'Amount' | 'Quantity' | 'Country' | 'ProductName';

const REQUIRED_FIELDS: { key: RequiredField; label: string; required: boolean; description: string }[] = [
    { key: 'CustomerID', label: 'ID Клиента', required: true, description: 'Уникальный идентификатор покупателя' },
    { key: 'InvoiceDate', label: 'Дата транзакции', required: true, description: 'Дата и время покупки' },
    { key: 'Amount', label: 'Сумма / Цена', required: true, description: 'Стоимость единицы или общая сумма' },
    { key: 'Quantity', label: 'Количество', required: false, description: 'Количество товаров (по умолчанию 1)' },
    { key: 'Country', label: 'Страна', required: false, description: 'Страна покупателя' },
    { key: 'ProductName', label: 'Название товара', required: false, description: 'Наименование продукта' },
];

export function ColumnMapper({ headers, previewData, onConfirm, onCancel }: ColumnMapperProps) {
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [isValid, setIsValid] = useState(false);

    // Auto-detection logic
    useEffect(() => {
        const newMapping: Record<string, string> = {};

        REQUIRED_FIELDS.forEach(field => {
            const lowerField = field.key.toLowerCase();
            const match = headers.find(h => {
                const lowerHeader = h.toLowerCase().replace(/[^a-z0-9]/g, '');
                return lowerHeader.includes(lowerField) ||
                    (field.key === 'CustomerID' && (lowerHeader.includes('client') || lowerHeader.includes('user'))) ||
                    (field.key === 'Amount' && (lowerHeader.includes('price') || lowerHeader.includes('revenue') || lowerHeader.includes('total'))) ||
                    (field.key === 'InvoiceDate' && (lowerHeader.includes('date') || lowerHeader.includes('time')));
            });

            if (match) {
                newMapping[field.key] = match;
            }
        });

        setMapping(newMapping);
    }, [headers]);

    // Validation logic
    useEffect(() => {
        const requiredMissing = REQUIRED_FIELDS
            .filter(f => f.required)
            .some(f => !mapping[f.key]);
        setIsValid(!requiredMissing);
    }, [mapping]);

    const handleMappingChange = (field: string, column: string) => {
        setMapping(prev => ({ ...prev, [field]: column }));
    };

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center justify-between">
                    <span>Настройка колонок</span>
                    <span className="text-sm font-normal text-muted-foreground">Шаг 2 из 3</span>
                </CardTitle>
                <CardDescription>
                    Сопоставьте колонки из вашего файла с полями, необходимыми для анализа.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Mapping Grid */}
                <div className="grid gap-6">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                        <div className="col-span-4">Необходимое поле</div>
                        <div className="col-span-4">Описание</div>
                        <div className="col-span-4">Ваша колонка</div>
                    </div>

                    {REQUIRED_FIELDS.map((field) => (
                        <div key={field.key} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4 flex items-center gap-2">
                                <span className={field.required ? "font-semibold text-foreground" : ""}>
                                    {field.label}
                                </span>
                                {field.required && <span className="text-red-500">*</span>}
                                {mapping[field.key] && <Check className="w-4 h-4 text-green-500" />}
                            </div>
                            <div className="col-span-4 text-sm text-muted-foreground">
                                {field.description}
                            </div>
                            <div className="col-span-4">
                                <Select
                                    value={mapping[field.key] || ''}
                                    onValueChange={(val: string) => handleMappingChange(field.key, val)}
                                >
                                    <SelectTrigger className={!mapping[field.key] && field.required ? "border-red-300 bg-red-50" : ""}>
                                        <SelectValue placeholder="Выберите колонку" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {headers.map(header => (
                                            <SelectItem key={header} value={header}>
                                                {header}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data Preview (Mapped) */}
                <div className="rounded-md border bg-muted/20 p-4 mt-8">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Предпросмотр результата (первые 3 строки)
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-left text-muted-foreground border-b">
                                    {REQUIRED_FIELDS.map(f => (
                                        <th key={f.key} className="p-2 font-medium">{f.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(0, 3).map((row, i) => (
                                    <tr key={i} className="border-b last:border-0">
                                        {REQUIRED_FIELDS.map(f => (
                                            <td key={f.key} className="p-2">
                                                {mapping[f.key] ? row[mapping[f.key]] : <span className="text-muted-foreground italic">-</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t">
                    <Button variant="ghost" onClick={onCancel}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Сбросить и начать заново
                    </Button>
                    <Button
                        onClick={() => onConfirm(mapping)}
                        disabled={!isValid}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Начать анализ
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
