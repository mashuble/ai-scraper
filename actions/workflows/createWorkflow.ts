"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/tasks";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function createWorkflow(form: CreateWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);

    if (!success) {
        throw new Error('invalid form data');
    }

    const { userId } = await auth();

    if (!userId) {
        throw new Error('unauthenticated');
    }

    const initialFlow: { nodes: AppNode[], edges: Edge[] } = {
        nodes: [],
        edges: []
    };

    // Let's add the flow entry point
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow),
            ...data
        },
    });

    if(!result) {
        throw new Error('failed to create workflow');
    }

    return redirect(`/workflow/editor/${result.id}`);
}