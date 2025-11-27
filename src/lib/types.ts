export interface Transaction {
    CustomerID: string;
    InvoiceDate: string;
    Quantity: number;
    UnitPrice: number;
    Country: string;
    InvoiceNo?: string;
    StockCode?: string;
    Description?: string;
}

export interface Customer {
    id: string;
    recency: number; // Days since last purchase
    frequency: number; // Total number of orders
    monetary: number; // Total spend
    r_score: number;
    f_score: number;
    m_score: number;
    segment: string;
    country: string;
}

export interface RFMSegment {
    name: string;
    description: string;
    count: number;
    percentage: number;
    avg_monetary: number;
    avg_recency: number;
    color: string; // hex or tailwind class
}

export interface Cluster {
    name: string;
    count: number;
    avg_order_value: number;
    purchase_frequency: number;
    last_purchase_date: string;
    description: string;
}
