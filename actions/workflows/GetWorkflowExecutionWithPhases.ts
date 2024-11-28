"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { WorkflowExecution, ExecutionPhase } from "@prisma/client";


export const GetWorkflowExecutionWithPhases = async (executionId: string): Promise<WorkflowExecution & { phases: ExecutionPhase[] }> => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("unauthenticated");
    }

    return await prisma.workflowExecution.findUnique({
        where: { id: executionId, userId },
        include: { 
            phases: {
                orderBy: {
                    number: "asc"
                }
            }
        }
    });

}