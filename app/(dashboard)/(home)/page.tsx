"use server"

import { redirect } from "next/navigation";
import { useAuth } from '@clerk/nextjs';
import { GetPeriods } from "@/actions/analytics/GetPeriods";
import { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/GetStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { GetWorkflowExecutionStats } from "@/actions/analytics/GetWorkflowExecutionStats";
import { cn } from "@/lib/utils";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/GetCreditsUsageInPeriod";
import CreditsUsageChart from "../billing/_components/CreditsUsageChart";

function HomePage({ searchParams }: { searchParams: { month?: string, year?: string } }) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear()
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className='w-[180px] h-[40px]' />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton className='h-[300px]' />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton className='h-[300px]' />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const periods = await GetPeriods();

  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValues(selectedPeriod);

  return (
    <div className="grid lg:grid-cols-3 gap-3 lg:gap-8 min-h-[120px]">
      <StatsCard title="Workflow Executions" value={data.workflowExecutions} icon={CirclePlayIcon} />
      <StatsCard title="Credits Consumed" value={data.creditsConsumed} icon={CoinsIcon} />
      <StatsCard title="Phases Executions" value={data.phasesExecutions} icon={WaypointsIcon} />
    </div>
    )
}

function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 lg:gap-8 lg:grid-cols-3", className)}> 
      <Skeleton className='w-full h-[120px]' />
      <Skeleton className='w-full h-[120px]' />
      <Skeleton className='w-full h-[120px]' />
    </div>
  )
}

async function StatsExecutionStatus({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);

  return <ExecutionStatusChart data={data} />
}

async function CreditsUsageInPeriod({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod);

  return <CreditsUsageChart
    data={data}
    title="Daily Credits Spent"
    description="Daily credits consumed in selected period"
  />
}

export default HomePage