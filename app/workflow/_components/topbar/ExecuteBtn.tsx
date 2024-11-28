"use client"

import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    workflowId: string;
}

function ExecuteBtn({ workflowId }: Props) {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();

    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => {
            toast.success('Execution started', {id: 'flow-execution'});
        },
        onError: () => {
            toast.error('Something went wrong', {id: 'flow-execution'});
        }
    });

    return (
        <Button 
            variant='outline' 
            className='flex items-center gap-2' 
            disabled={mutation.isPending}
            onClick={() => {
                const plan = generate();
                if(!plan) return; // Client side validation!
                mutation.mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
            }}
        >
            <PlayIcon size={16} className='stroke-orange-400' />
            Execute
        </Button>
    )
}

export default ExecuteBtn