"use client";

import { GetWorkflowExecutions } from "@/actions/workflows/GetWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

export default function ExecutionsTable({ workflowId, initialData }: { workflowId: string, initialData: InitialDataType }) {
    const router = useRouter();

    const query = useQuery({
        queryKey: ["executions", workflowId],
        initialData,
        queryFn: () => GetWorkflowExecutions(workflowId),
        refetchInterval: 5000
    });

    return (
        <div className="border rounded-lg shadow-md overflow-auto">
            <Table className="h-full">
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consumed</TableHead>
                        <TableHead className="text-right text-xs text-muted-foreground">Started At (desc)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="gap-2 h-full overflow-auto">
                    {query.data?.map((execution) => {
                        const duration = DatesToDurationString(execution.completedAt, execution.startedAt);

                        const formattedStartedAt = execution.startedAt && formatDistanceToNow(execution.startedAt, { addSuffix: true });

                        return (
                            <TableRow key={execution.id} className="cursor-pointer hover:bg-muted" onClick={() => {
                                router.push(`/workflow/runs/${workflowId}/${execution.id}`);
                            }}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{execution.id}</span>
                                        <div className="text-muted-foreground text-xs">
                                            <span>Triggered via</span>
                                            <Badge variant="outline">{execution.trigger}</Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <ExecutionStatusIndicator status={execution.status} />
                                            <span className="font-semibold capitalize">{execution.status}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mx-5">{duration}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <CoinsIcon size={16} className="text-primary" />
                                            <span className="font-semibold capitalize">{execution.creditsConsumed}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mx-5">Credits</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">{formattedStartedAt}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}