import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { DataUpload } from '@/components/dashboard/DataUpload'
import { Transaction, Customer } from '@/lib/types'
import { RFMGrid } from '@/components/dashboard/RFMGrid'
import { ClusterAnalysis } from '@/components/dashboard/ClusterAnalysis'
import { TemporalTrends } from '@/components/dashboard/TemporalTrends'
import { HolidayAnalysis } from '@/components/dashboard/HolidayAnalysis'
import { Recommendations } from '@/components/dashboard/Recommendations'
import { ExportPanel } from '@/components/dashboard/ExportPanel'
import { LandingPage } from '@/components/landing/LandingPage'
import { useAuth } from '@/contexts/AuthContext'

function App() {
    const { isAuthenticated } = useAuth()
    const [activeTab, setActiveTab] = useState('upload')
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])

    const handleDataLoaded = (data: Transaction[], customerData: Customer[]) => {
        setTransactions(data)
        setCustomers(customerData)
        setActiveTab('segments') // Auto-switch to segments after upload
    }

    // Показываем лендинг, если пользователь не авторизован
    if (!isAuthenticated) {
        return <LandingPage />
    }

    return (
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'upload' && (
                <DataUpload onDataLoaded={handleDataLoaded} />
            )}
            {activeTab !== 'upload' && transactions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <h3 className="text-lg font-semibold mb-2">Нет загруженных данных</h3>
                    <p className="text-muted-foreground mb-4">Пожалуйста, загрузите данные о транзакциях для просмотра аналитики.</p>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className="text-primary hover:underline"
                    >
                        Перейти к загрузке
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
                    {activeTab === 'holidays' && (
                        <HolidayAnalysis transactions={transactions} />
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
