import React, { Suspense } from 'react'
import Topbar from '@/app/workflow/_components/topbar/Topbar'
import { GetWorkflowExecutions } from '@/actions/workflows/GetWorkflowExecutions';
import { InboxIcon, Loader2Icon } from 'lucide-react';
import ExecutionsTable from './_components/ExecutionsTable';

function ExecutionPage({ params }: { params: { workflowId: string } }) {
  return (
    <div className='h-full w-full overflow-auto'>
        <Topbar workflowId={params.workflowId} title='All runs' hideButtons subtitle='List of all your workflow runs' />
        <Suspense fallback={
            <div className='flex justify-center items-center h-full w-full'>
                <Loader2Icon className='animate-spin stroke-primary' />
            </div>
        }> 
            <ExecutionsTableWrapper workflowId={params.workflowId} />
        </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
    const executions = await GetWorkflowExecutions(workflowId);

    if(!executions) {
        return <div>No data</div>;
    }

    if(executions.length === 0) {
        return <div className='container w-full py-6'>
            <div className='flex flex-col items-center gap-2 justify-center w-full h-full'>
                <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                    <InboxIcon size={40} className='stroke-primary' />
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <p className="font-bold">
                        No runs have been triggered yet for this workflow
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can trigger a run from the editor page
                    </p>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="container py-6 w-full">
            <ExecutionsTable workflowId={workflowId} initialData={executions} />
        </div>
    )


}


export default ExecutionPage