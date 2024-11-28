'use client';

import { UpdateWorkflow } from '@/actions/workflows/updateWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

interface Props {
    workflowId: string;
}

function SaveBtn({ workflowId }: Props) {
    const { toObject } = useReactFlow();

    const saveMutation = useMutation({
        mutationFn: UpdateWorkflow,
        onSuccess: () => {
            toast.success('Workflow saved', { id: "save-workflow"});
        },
        onError: () => {
            toast.error('Failed to save workflow', { id: "save-workflow"});
        }
    });

  return (
    <Button 
        variant='outline'
        className='flex items-center gap-2'
        disabled={saveMutation.isPending}
        onClick={() => {
            const workflowDefinition = JSON.stringify(toObject());
            toast.loading('Saving workflow...', { id: "save-workflow"});
            saveMutation.mutate({ 
                id: workflowId, 
                definition: workflowDefinition 
            });
        }}
    >
        <CheckIcon size={16} className='text-green-400' />
        Save
    </Button>
  )
}

export default SaveBtn