import React, { useState } from 'react';
import {
    LayoutDashboard,
    Upload,
    Users,
    PieChart,
    TrendingUp,
    Calendar,
    Lightbulb,
    Download,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const SidebarItem = ({
    icon: Icon,
    label,
    active,
    onClick
}: {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1",
            active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
    >
        <Icon className="w-5 h-5 mr-3" />
        {label}
    </button>
);

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'upload', label: 'Загрузка данных', icon: Upload },
        { id: 'segments', label: 'RFM сегменты', icon: LayoutDashboard },
        { id: 'clusters', label: 'Кластеры клиентов', icon: Users },
        { id: 'trends', label: 'Временные тренды', icon: TrendingUp },
        { id: 'holidays', label: 'Анализ праздников', icon: Calendar },
        { id: 'recommendations', label: 'AI рекомендации', icon: Lightbulb },
        { id: 'export', label: 'Экспорт и интеграция', icon: Download },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <PieChart className="w-6 h-6 text-primary" />
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Segmenticus AI
                        </span>
                    </div>
                    <button
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto flex-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                setIsSidebarOpen(false);
                            }}
                        />
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex items-center justify-between h-16 px-6 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button
                            className="mr-4 md:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-semibold">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground hidden sm:block">
                            {user?.name || user?.email}
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                            title="Выйти"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Выйти</span>
                        </button>
                    </div>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
