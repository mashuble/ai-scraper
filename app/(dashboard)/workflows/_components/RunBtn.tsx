"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
    workflowId: string;
}

function RunBtn({ workflowId }: Props) {
    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => {
            toast.success('Workflow started', {id: workflowId});
        },
        onError: () => {
            toast.error('Something went wrong', {id: workflowId});
        }
    });

    return <Button 
        variant='outline' 
        size='sm' 
        className="flex items-center gap-2" 
        onClick={() => {
            toast.loading('Starting workflow...', {id: workflowId});
            mutation.mutate({ workflowId });
        }}
        disabled={mutation.isPending}
    >
        <PlayIcon size={16} className='w-4 h-4' />
        Run
    </Button>
}

export default RunBtn