import { useState } from 'react';
import { Customer, Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, Database, Check } from 'lucide-react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';

interface ExportPanelProps {
    customers: Customer[];
    transactions: Transaction[];
}

export function ExportPanel({ customers, transactions }: ExportPanelProps) {
    const [downloading, setDownloading] = useState<string | null>(null);

    const exportCSV = (type: 'customers' | 'transactions') => {
        setDownloading(type);

        setTimeout(() => {
            const data = type === 'customers' ? customers : transactions;
            const csv = Papa.unparse(data as any[]);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `segmenticus_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloading(null);
        }, 800);
    };

    const exportPDF = () => {
        setDownloading('pdf');
        setTimeout(() => {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('Segmenticus AI - Insight Report', 20, 20);

            doc.setFontSize(12);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
            doc.text(`Total Customers: ${customers.length}`, 20, 40);
            doc.text(`Total Transactions: ${transactions.length}`, 20, 50);

            doc.text('Segment Distribution:', 20, 70);
            let y = 80;

            const segments: Record<string, number> = {};
            customers.forEach(c => segments[c.segment] = (segments[c.segment] || 0) + 1);

            Object.entries(segments).forEach(([seg, count]) => {
                doc.text(`- ${seg}: ${count} customers`, 30, y);
                y += 10;
            });

            doc.save('segmenticus_report.pdf');
            setDownloading(null);
        }, 1000);
    };

    const exportCRM = () => {
        setDownloading('crm');
        setTimeout(() => {
            // Mock CRM export
            setDownloading(null);
            alert('Successfully exported to Bitrix24 (Mock)');
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Export & Integration</h2>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Export</CardTitle>
                        <CardDescription>Download raw data for external analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => exportCSV('customers')}
                            disabled={!!downloading}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Export Customers (CSV)
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => exportCSV('transactions')}
                            disabled={!!downloading}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Export Transactions (CSV)
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                        <CardDescription>Generate executive summaries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full"
                            onClick={exportPDF}
                            disabled={!!downloading}
                        >
                            {downloading === 'pdf' ? (
                                <Check className="mr-2 h-4 w-4" />
                            ) : (
                                <FileDown className="mr-2 h-4 w-4" />
                            )}
                            Download PDF Report
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>CRM Integration</CardTitle>
                        <CardDescription>Sync segments with your CRM.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={exportCRM}
                            disabled={!!downloading}
                        >
                            <Database className="mr-2 h-4 w-4" />
                            {downloading === 'crm' ? 'Syncing...' : 'Sync to Bitrix24'}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            Connected to: Demo Account
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
