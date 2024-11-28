'use server'

import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { auth } from '@clerk/nextjs/server'

export const GetPeriods = async () => {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('unauthenticated')
    }

    const years = await prisma.workflowExecution.aggregate({
        where: { userId },
        _min: { startedAt: true }
    });

    const currentYear = new Date().getFullYear();

    const minYear = years._min.startedAt ? new Date(years._min.startedAt).getFullYear() : currentYear;

    const periods: Period[] = [];
    for(let year = minYear; year <= currentYear; year++) {
        for(let month = 1; month <= 12; month++) {
            periods.push({
                year,
                month
            })
        }
    }

    return periods;
}