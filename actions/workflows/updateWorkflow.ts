"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';

interface UpdateWorkflowProps { 
    id: string;
    definition: string;
}

export async function UpdateWorkflow({ id, definition }: UpdateWorkflowProps) {
    const { userId } = await auth();

    if(!userId) {
        throw new Error('unauthenticated');
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    });

    if(!workflow) throw new Error('workflow not found');
    if(workflow.status !== WorkflowStatus.DRAFT) throw new Error('workflow is not in draft state');

    await prisma.workflow.update({
        data: {
            definition
        },
        where: {
            id,
            userId
        }
    });

    revalidatePath(`/workflows`)
}