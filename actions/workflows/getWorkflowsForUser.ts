"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Workflow } from "@prisma/client";

export async function getWorkflowsForUser(): Promise<Workflow[]> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    return await prisma.workflow.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" }
    });
}