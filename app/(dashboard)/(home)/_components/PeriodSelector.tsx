"use client"

import { Period } from '@/types/analytics'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation';

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
] as const;

function PeriodSelector({ periods, selectedPeriod }: { periods: Period[], selectedPeriod: Period }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePeriodChange = (value: string) => {
        const [month, year] = value.split('-');
        const params = new URLSearchParams();
        params.set('month', month);
        params.set('year', year);

        router.push(`?${params.toString()}`);
    }

    return (
        <Select 
            value={`${selectedPeriod.month}-${selectedPeriod.year}`}
            onValueChange={handlePeriodChange}
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder="Select a period" />
            </SelectTrigger>
            <SelectContent>
                {periods.map((period, index) => (
                <SelectItem key={index} value={`${period.month}-${period.year}`}>{`${MONTH_NAMES[period.month]} ${period.year}`}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default PeriodSelector