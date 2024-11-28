'use client';

import { GetWorkflowExecutionStats } from '@/actions/analytics/GetWorkflowExecutionStats';
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Layers2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;

const chartConfig = {
    success: {
        color: 'hsl(var(--chart-2))',
        label: 'Success'
    },
    failed: {
        color: 'hsl(var(--chart-1))',
        label: 'Failed'
    }
}

function ExecutionStatusChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold flex items-center gap-2'>
            <Layers2 className='w-6 h-6 text-primary' />
            Workflow Execution Status
        </CardTitle>
        <CardDescription>
            daily number of successful and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[200px] w-full'>
            <AreaChart 
                data={data} 
                height={200}
                accessibilityLayer
                margin={{
                    top: 20
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis 
                    dataKey='date' 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={18} 
                    minTickGap={32} 
                    tickFormatter={(value) => {
                        const date = new Date(value);

                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }} 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip content={<ChartTooltipContent className='w-[250px]' />} />
                <Area 
                    min={0} 
                    type='bump' 
                    fillOpacity={0.6}
                    fill={'var(--color-success)'} 
                    stroke={'var(--color-success)'}
                    dataKey={'success'} 
                    stackId={'A'}
                />
                <Area 
                    min={0} 
                    type='bump' 
                    fill={'var(--color-failed)'} 
                    stroke={'var(--color-failed)'}
                    dataKey={'failed'} 
                    stackId={'B'}
                />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ExecutionStatusChart