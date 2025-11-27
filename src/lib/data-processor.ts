import Papa from 'papaparse';
import { Transaction, Customer } from './types';
import { format, subDays, differenceInDays } from 'date-fns';

export const generateMockData = (count: number = 1000): Transaction[] => {
    const countries = ['United Kingdom', 'France', 'Germany', 'USA', 'Spain'];
    const data: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const date = subDays(now, Math.floor(Math.random() * 365));
        data.push({
            CustomerID: `CUST-${Math.floor(Math.random() * 200) + 1000}`,
            InvoiceDate: format(date, 'yyyy-MM-dd HH:mm:ss'),
            Quantity: Math.floor(Math.random() * 10) + 1,
            UnitPrice: Number((Math.random() * 100 + 5).toFixed(2)),
            Country: countries[Math.floor(Math.random() * countries.length)],
            InvoiceNo: `INV-${Math.floor(Math.random() * 10000)}`,
            Description: `Product ${Math.floor(Math.random() * 50)}`
        });
    }
    return data;
};

export const parseCSV = (file: File): Promise<Transaction[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[];
                // Basic validation/mapping
                const transactions: Transaction[] = data.map(row => ({
                    CustomerID: row.CustomerID || row['Customer ID'],
                    InvoiceDate: row.InvoiceDate || row['Invoice Date'],
                    Quantity: Number(row.Quantity),
                    UnitPrice: Number(row.UnitPrice || row['Unit Price']),
                    Country: row.Country,
                    InvoiceNo: row.InvoiceNo,
                    Description: row.Description
                })).filter(t => t.CustomerID && !isNaN(t.Quantity) && !isNaN(t.UnitPrice));

                resolve(transactions);
            },
            error: (error) => reject(error)
        });
    });
};

export const processTransactions = (transactions: Transaction[]): Customer[] => {
    const customers: Record<string, Customer> = {};
    const now = new Date();

    transactions.forEach(t => {
        if (!customers[t.CustomerID]) {
            customers[t.CustomerID] = {
                id: t.CustomerID,
                recency: 0,
                frequency: 0,
                monetary: 0,
                r_score: 0,
                f_score: 0,
                m_score: 0,
                segment: '',
                country: t.Country
            };
        }

        const customer = customers[t.CustomerID];
        customer.frequency += 1;
        customer.monetary += t.Quantity * t.UnitPrice;

        const txDate = new Date(t.InvoiceDate);
        const daysSince = differenceInDays(now, txDate);

        // Keep the smallest recency (most recent purchase)
        if (customer.recency === 0 || daysSince < customer.recency) {
            customer.recency = daysSince;
        }
    });

    // Calculate RFM Scores (Simple quintile approach)
    const customerList = Object.values(customers);

    // Helper to calculate score based on percentiles
    const assignScore = (arr: number[], value: number, isReverse: boolean = false) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const p20 = sorted[Math.floor(sorted.length * 0.2)];
        const p40 = sorted[Math.floor(sorted.length * 0.4)];
        const p60 = sorted[Math.floor(sorted.length * 0.6)];
        const p80 = sorted[Math.floor(sorted.length * 0.8)];

        if (isReverse) {
            if (value <= p20) return 5;
            if (value <= p40) return 4;
            if (value <= p60) return 3;
            if (value <= p80) return 2;
            return 1;
        } else {
            if (value <= p20) return 1;
            if (value <= p40) return 2;
            if (value <= p60) return 3;
            if (value <= p80) return 4;
            return 5;
        }
    };

    const recencies = customerList.map(c => c.recency);
    const frequencies = customerList.map(c => c.frequency);
    const monetaries = customerList.map(c => c.monetary);

    customerList.forEach(c => {
        c.r_score = assignScore(recencies, c.recency, true); // Lower recency is better
        c.f_score = assignScore(frequencies, c.frequency);
        c.m_score = assignScore(monetaries, c.monetary);

        // Assign Segment based on R and F (simplified standard matrix)
        if (c.r_score >= 4 && c.f_score >= 4) c.segment = 'Champions';
        else if (c.r_score >= 3 && c.f_score >= 3) c.segment = 'Loyal Customers';
        else if (c.r_score >= 4 && c.f_score >= 2) c.segment = 'Potential Loyalists';
        else if (c.r_score >= 3 && c.f_score <= 2) c.segment = 'Promising';
        else if (c.r_score <= 2 && c.f_score >= 4) c.segment = 'Can\'t Lose Them';
        else if (c.r_score <= 2 && c.f_score >= 2) c.segment = 'At Risk';
        else if (c.r_score <= 2 && c.f_score <= 1) c.segment = 'Lost';
        else c.segment = 'Needs Attention';
    });

    return customerList;
};
