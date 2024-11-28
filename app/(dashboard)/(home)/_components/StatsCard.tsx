import { LucideIcon } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function StatsCard({ title, value, icon }: { title: string, value: number, icon: LucideIcon }) {
    const Icon = icon;

    return (
        <Card className='relative overflow-hidden h-full'>
            <CardHeader className='flex pb-2'>
                <CardTitle>{title}</CardTitle>
                <Icon size={120} className='text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10' />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-primary">{value}</div>
            </CardContent>
        </Card>
    )
}

export default StatsCard