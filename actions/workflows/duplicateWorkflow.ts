"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { duplicateWorkflowSchema, DuplicateWorkflowSchemaType } from "@/schema/workflow";
import { revalidatePath } from "next/cache";
import { WorkflowStatus } from "@/types/workflow";

export async function DuplicateWorkflow(form: DuplicateWorkflowSchemaType) {

    const { success, data } = duplicateWorkflowSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid input");
    }

    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    const sourceWorkflow = await prisma.workflow.findUnique({
        where: {
            id: data.workflowId,
            userId,
        },
    });

    if (!sourceWorkflow) {
        throw new Error("Workflow not found");
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
            status: WorkflowStatus.DRAFT,
            definition: sourceWorkflow.definition,
        },
    });

    if (!result) {
        throw new Error("Failed to duplicate workflow");
    }

    revalidatePath("/workflows");
};