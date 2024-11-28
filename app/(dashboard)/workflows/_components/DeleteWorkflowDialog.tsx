'use client';

import React, { useCallback, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { DeleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteWorkflowDialogProps { 
    open: boolean, 
    setOpen: (open: boolean) => void,
    workflowName: string,
    workflowId: string
};

function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: DeleteWorkflowDialogProps) {
    const [confirmText, setConfirmText] = useState('');

    const deleteMutation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            setOpen(false);
            toast.success('Workflow deleted successfully', {
                id: `delete-workflow-${workflowId}`,
            });
            setConfirmText('');
        },
        onError: () => {
            toast.error('Failed to delete workflow', {
                id: `delete-workflow-${workflowId}`,
            });
        }
    });
    
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        If you delete this workflow, it will be permanently deleted.
                        <div className="flex flex-col py-4 gap-2">
                            <p>If you are sure, enter <b>{workflowName}</b> to confirm:</p>
                            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        disabled={confirmText !== workflowName || deleteMutation.isPending} 
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.loading('Deleting workflow...', {
                                id: 'delete-workflow',
                            });
                            deleteMutation.mutate(workflowId);
                        }} 
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteWorkflowDialog