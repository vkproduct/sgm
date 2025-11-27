import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { DataUpload } from '@/components/dashboard/DataUpload'
import { Transaction, Customer } from '@/lib/types'
import { RFMGrid } from '@/components/dashboard/RFMGrid'
import { ClusterAnalysis } from '@/components/dashboard/ClusterAnalysis'
import { TemporalTrends } from '@/components/dashboard/TemporalTrends'
import { Recommendations } from '@/components/dashboard/Recommendations'
import { ExportPanel } from '@/components/dashboard/ExportPanel'

function App() {
    const [activeTab, setActiveTab] = useState('upload')
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])

    const handleDataLoaded = (data: Transaction[], customerData: Customer[]) => {
        setTransactions(data)
        setCustomers(customerData)
        setActiveTab('segments') // Auto-switch to segments after upload
    }

    return (
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'upload' && (
                <DataUpload onDataLoaded={handleDataLoaded} />
            )}
            {activeTab !== 'upload' && transactions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <h3 className="text-lg font-semibold mb-2">No Data Loaded</h3>
                    <p className="text-muted-foreground mb-4">Please upload transaction data to view insights.</p>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className="text-primary hover:underline"
                    >
                        Go to Upload
                    </button>
                </div>
            )}
            {activeTab !== 'upload' && transactions.length > 0 && (
                <div className="space-y-6">
                    {activeTab === 'segments' && (
                        <RFMGrid customers={customers} />
                    )}
                    {activeTab === 'clusters' && (
                        <ClusterAnalysis customers={customers} />
                    )}
                    {activeTab === 'trends' && (
                        <TemporalTrends transactions={transactions} />
                    )}
                    {activeTab === 'recommendations' && (
                        <Recommendations customers={customers} />
                    )}
                    {activeTab === 'export' && (
                        <ExportPanel customers={customers} transactions={transactions} />
                    )}
                </div>
            )}
        </Layout>
    )
}

export default App
