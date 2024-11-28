'use server';

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/period";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, { success: number, failed: number }>;

export async function GetCreditsUsageInPeriod(period: Period) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    const dateRange = PeriodToDateRange(period);

    const executionPhases = await prisma.executionPhase.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate
            },
            status: {
                in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED]
            }
        }
    });

    const dateFormat = "yyyy-MM-dd";

    const stats: Stats = eachDayOfInterval({ start: dateRange.startDate, end: dateRange.endDate })
        .map((date) => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = {
                success: 0,
                failed: 0
            };
            return acc;
        }, {} as Stats);

    executionPhases.forEach((executionPhase) => {
        const date = format(executionPhase.startedAt, dateFormat);

        if (executionPhase.status === ExecutionPhaseStatus.COMPLETED) {
            stats[date].success += executionPhase.creditsConsumed || 0;
        } 

        if (executionPhase.status === ExecutionPhaseStatus.FAILED) {
            stats[date].failed += executionPhase.creditsConsumed || 0;
        }
    });

    const result = Object.entries(stats)
        .map(([date, infos]) => ({
            date,
            ...infos
        }));

    return result;
}