import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

export async function GET() {
    const now = new Date();
    
    const workflows = await prisma.workflow.findMany({
        where: {
            status: WorkflowStatus.PUBLISHED,
            cron: {
                not: null
            },
            nextRunAt: {
                lte: now
            }
        },
        select: {
            id: true
        }
    });

    console.log("@@WORKFLOW TO RUN", workflows.length);

    for(const workflow of workflows) {
        triggerWorkflow(workflow.id);
    }

    return Response.json({ workflows: workflows.length }, { status: 200 });
}

async function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);
    
    fetch(triggerApiUrl, {
        headers: {
            'Authorization': `Bearer ${process.env.API_SECRET!}`
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
    }).catch((err) => {
        console.error("@@TRIGGER WORKFLOW ERROR", workflowId, err.message);
    });
}