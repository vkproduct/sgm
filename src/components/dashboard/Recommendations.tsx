import React, { useState } from 'react';
import { Customer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Tag, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

interface RecommendationsProps {
    customers: Customer[];
}

export function Recommendations({ customers }: RecommendationsProps) {
    const [generating, setGenerating] = useState(false);
    const totalCustomers = customers.length;

    const strategies = [
        {
            segment: 'Champions',
            title: 'VIP Appreciation Program',
            description: 'Reward your best customers with exclusive early access to new products and a dedicated support line.',
            action: 'Send Exclusive Invite',
            icon: Sparkles,
            color: 'text-purple-500'
        },
        {
            segment: 'Loyal Customers',
            title: 'Referral Campaign',
            description: 'Encourage these consistent buyers to refer friends in exchange for store credit.',
            action: 'Launch Referral Email',
            icon: UsersIcon,
            color: 'text-blue-500'
        },
        {
            segment: 'At Risk',
            title: 'Win-Back Offer',
            description: 'They haven\'t purchased in a while. Send a high-value discount code (20% off) to re-engage them.',
            action: 'Send Discount Code',
            icon: Tag,
            color: 'text-orange-500'
        },
        {
            segment: 'Hibernating',
            title: 'Survey & Feedback',
            description: 'Find out why they stopped shopping. Send a short survey with a small incentive.',
            action: 'Send Survey',
            icon: Mail,
            color: 'text-gray-500'
        }
    ];

    // Mock AI Generation
    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AI Marketing Recommendations</h2>
                    <p className="text-muted-foreground">Automated strategies for {totalCustomers} customers.</p>
                </div>
                <Button onClick={handleGenerate} disabled={generating}>
                    {generating ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Generating Insights...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Refresh Recommendations
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {strategies.map((strategy, i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <strategy.icon className={`w-5 h-5 ${strategy.color}`} />
                                <span className={`text-sm font-medium ${strategy.color} bg-opacity-10 px-2 py-0.5 rounded-full bg-current`}>
                                    Target: {strategy.segment}
                                </span>
                            </div>
                            <CardTitle>{strategy.title}</CardTitle>
                            <CardDescription>{strategy.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="bg-muted/50 p-4 rounded-md text-sm italic">
                                "Subject: Special treat for our favorite customer..."
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">
                                {strategy.action} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
