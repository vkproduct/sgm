import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parseCSV, generateMockData, processTransactions } from '@/lib/data-processor';
import { Transaction, Customer } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DataUploadProps {
    onDataLoaded: (transactions: Transaction[], customers: Customer[]) => void;
}

export function DataUpload({ onDataLoaded }: DataUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<Transaction[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processData = async (transactions: Transaction[]) => {
        try {
            setIsLoading(true);
            setError(null);

            // Simulate processing delay for effect
            await new Promise(resolve => setTimeout(resolve, 800));

            const customers = processTransactions(transactions);
            setPreviewData(transactions.slice(0, 5));
            onDataLoaded(transactions, customers);
        } catch (err) {
            setError('Не удалось обработать данные. Проверьте формат файла.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            try {
                const data = await parseCSV(file);
                processData(data);
            } catch (err) {
                setError('Ошибка при чтении CSV файла.');
            }
        } else {
            setError('Пожалуйста, загрузите корректный CSV файл.');
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const data = await parseCSV(file);
                processData(data);
            } catch (err) {
                setError('Error parsing CSV file.');
            }
        }
    };

    const loadSampleData = () => {
        const data = generateMockData(1500);
        processData(data);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Загрузка данных о транзакциях</CardTitle>
                        <CardDescription>
                            Загрузите данные о продажах (CSV) для анализа.
                            Обязательные колонки: CustomerID, InvoiceDate, Quantity, UnitPrice, Country.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer",
                                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                                isLoading && "opacity-50 pointer-events-none"
                            )}
                        >
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                                <span className="text-lg font-medium">Перетащите CSV файл сюда или нажмите для загрузки</span>
                                <span className="text-sm text-muted-foreground mt-2">Максимальный размер: 10MB</span>
                            </label>
                        </div>

                        <div className="mt-6 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground mr-4">Или используйте демо-данные:</span>
                            <Button variant="outline" onClick={loadSampleData} disabled={isLoading}>
                                Загрузить демо-данные
                            </Button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Предпросмотр данных</CardTitle>
                        <CardDescription>
                            Первые 5 строк загруженного набора данных.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {previewData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-2">Дата</th>
                                            <th className="px-4 py-2">Клиент</th>
                                            <th className="px-4 py-2">Сумма</th>
                                            <th className="px-4 py-2">Страна</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="border-b last:border-0">
                                                <td className="px-4 py-2">{row.InvoiceDate}</td>
                                                <td className="px-4 py-2">{row.CustomerID}</td>
                                                <td className="px-4 py-2">${(row.Quantity * row.UnitPrice).toFixed(2)}</td>
                                                <td className="px-4 py-2">{row.Country}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 flex items-center text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Данные успешно загружены
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <FileText className="w-8 h-8 mb-2 opacity-50" />
                                <p>Данные еще не загружены</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
