'use client';

import React, { useCallback, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { DeleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteCredential } from '@/actions/credentials/DeleteCredential';

interface DeleteCredentialDialogProps { 
    name: string
};

function DeleteCredentialDialog({ name }: DeleteCredentialDialogProps) {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const deleteMutation = useMutation({
        mutationFn: DeleteCredential,
        onSuccess: () => {
            setOpen(false);
            toast.success('Credential deleted successfully', {
                id: `delete-credential-${name}`,
            });
            setConfirmText('');
        },
        onError: () => {
            toast.error('Failed to delete credential', {
                id: `delete-credential-${name}`,
            });
        }
    });
    
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant='destructive' size={'icon'}>
                    <XIcon size={18} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        If you delete this credential, it will be permanently deleted.
                        <div className="flex flex-col py-4 gap-2">
                            <p>If you are sure, enter <b>{name}</b> to confirm:</p>
                            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        disabled={confirmText !== name || deleteMutation.isPending} 
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.loading('Deleting credential...', {
                                id: `delete-credential-${name}`,
                            });
                            deleteMutation.mutate(name);
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

export default DeleteCredentialDialog