"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({id, cron}: {id: string, cron: string}) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    try {
        const interval = parser.parseExpression(cron, { utc: true });

        await prisma.workflow.update({
            where: { 
                id, 
                userId 
            },
            data: { 
                cron, 
                nextRunAt: interval.next().toDate() 
            },
        });
    } catch (error) {
        console.error("invalid cron expression", error);
        throw new Error("invalid cron expression");
    }

    revalidatePath(`/workflows`);
}