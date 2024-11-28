"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { ExecutionPhase } from '@prisma/client';

export async function GetWorkflowPhaseDetails(phaseId: string): Promise<ExecutionPhase | null> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    return prisma.executionPhase.findUnique({ 
        where: { 
            id: phaseId, 
            execution: {
                userId,
            }
        },
        include: {
            logs: {
                orderBy: {
                    timestamp: "asc",
                },
            },
        }
    });
}