import { AuthForm } from '@/components/auth/AuthForm';
import { PieChart, BarChart3, Users, Zap, Check, ArrowRight, X, Lock as LockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LandingPage() {
    const scrollToAuth = () => {
        document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Segmenticus
                        </span>
                    </div>
                    <Button variant="ghost" onClick={scrollToAuth}>Войти</Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50/40 via-white to-white"></div>

                {/* Custom Animation Styles */}
                <style>
                    {`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                    .animate-float {
                        animation: float 8s ease-in-out infinite;
                    }
                    .animate-float-delayed {
                        animation: float 8s ease-in-out infinite;
                        animation-delay: 4s;
                    }
                    `}
                </style>

                <div className="container mx-auto px-4 text-center max-w-5xl">
                    <div className="space-y-8 animate-float">
                        <h1 className="text-5xl md:text-7xl font-light leading-tight tracking-tight text-gray-900">
                            Поймите своих клиентов <br />
                            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                с помощью анализа данных
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Автоматическая RFM-сегментация, кластерный анализ и персональные маркетинговые стратегии для роста вашего бизнеса.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                            <Button size="lg" onClick={scrollToAuth} className="bg-primary text-lg px-10 py-6 h-auto font-normal shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 rounded-full">
                                Начать бесплатно <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-10 py-6 h-auto font-normal border hover:bg-gray-50 rounded-full">
                                Узнать больше
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-sm font-light text-gray-500 pt-12 animate-float-delayed opacity-80">
                            <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Без кредитной карты</div>
                            <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Быстрый старт</div>
                            <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> 14 дней бесплатно</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Почему Segmenticus AI?</h2>
                        <p className="text-gray-600 text-lg">
                            Мы превращаем сырые данные о транзакциях в понятные инсайты, которые помогают увеличивать повторные продажи и LTV.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg bg-blue-50/50">
                            <CardHeader>
                                <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
                                <CardTitle>RFM Сегментация</CardTitle>
                                <CardDescription>
                                    Автоматически делим базу на "Чемпионов", "Лояльных", "Спящих" и другие сегменты. Вы точно знаете, с кем и как работать.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-none shadow-lg bg-purple-50/50">
                            <CardHeader>
                                <Users className="w-12 h-12 text-purple-600 mb-4" />
                                <CardTitle>Кластерный Анализ</CardTitle>
                                <CardDescription>
                                    Глубокое понимание портрета клиента. Выявляем скрытые паттерны поведения, которые не видны при обычном анализе.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-none shadow-lg bg-indigo-50/50">
                            <CardHeader>
                                <Zap className="w-12 h-12 text-indigo-600 mb-4" />
                                <CardTitle>AI Рекомендации</CardTitle>
                                <CardDescription>
                                    Наш AI генерирует готовые маркетинговые стратегии для каждого сегмента. Просто берите и внедряйте.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Простые и честные тарифы</h2>
                        <p className="text-gray-600 text-lg">
                            Выберите план, который подходит вашему бизнесу. Можно начать бесплатно.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-2xl">Старт</CardTitle>
                                <CardDescription>Для небольших магазинов</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">0 ₽</span>
                                    <span className="text-muted-foreground"> / месяц</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> До 100 транзакций</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Базовый RFM анализ</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> 3 сегмента клиентов</li>
                                    <li className="flex items-center text-muted-foreground"><X className="w-5 h-5 mr-2" /> Без экспорта данных</li>
                                    <li className="flex items-center text-muted-foreground"><X className="w-5 h-5 mr-2" /> Базовые AI советы</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="outline" onClick={scrollToAuth}>Выбрать Старт</Button>
                            </CardFooter>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="relative overflow-hidden border-2 border-purple-600 shadow-2xl scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                ПОПУЛЯРНЫЙ
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl">Бизнес</CardTitle>
                                <CardDescription>Для растущих компаний</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">2 990 ₽</span>
                                    <span className="text-muted-foreground"> / месяц</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center"><Check className="w-5 h-5 text-purple-600 mr-2" /> Безлимитное количество транзакции</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-purple-600 mr-2" /> Продвинутый многофакторный анализ</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-purple-600 mr-2" /> Все сегменты клиентов</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-purple-600 mr-2" /> Экспорт (CSV, PDF)</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-purple-600 mr-2" /> Персональные стратегии</li>
                                    <li className="flex items-center"><Check className="w-5 h-5 text-purple-600 mr-2" /> Интеграция с CRM</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={scrollToAuth}>Попробовать бесплатно 14 дней</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Auth Section */}
            <section id="auth-section" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Готовы увеличить продажи?</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Присоединяйтесь к тысячам предпринимателей, которые уже используют силу данных для роста своего бизнеса.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                        <Zap className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Мгновенный результат</h3>
                                        <p className="text-gray-600">Загрузите CSV и получите анализ через 5 секунд.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <LockIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Безопасность данных</h3>
                                        <p className="text-gray-600">Ваши данные обрабатываются локально в браузере.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <AuthForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-8">
                        <PieChart className="w-6 h-6 text-purple-400" />
                        <span className="text-xl font-bold">Segmenticus AI</span>
                    </div>
                    <p className="text-gray-400 mb-8">© 2025 Segmenticus AI. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
}
