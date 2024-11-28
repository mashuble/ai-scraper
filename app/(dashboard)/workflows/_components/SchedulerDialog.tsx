'use client';

import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { UpdateWorkflowCron } from '@/actions/workflows/UpdateWorkflowCron';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';
import { RemoveWorkflowSchedule } from '@/actions/workflows/REmoveWorkflowSchedule';
import { Separator } from '@/components/ui/separator';

function SchedulerDialog(props: { workflowId: string, cron: string | null }) {
    const [cron, setCron] = useState(props.cron || "");
    const [validCron, setValidCron] = useState(false);
    const [readableCron, setReadableCron] = useState('');

    const mutate = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: () => {
            toast.success('Workflow schedule updated', { id: "cron"});
        },
        onError: () => {
            toast.error('Something went wrong', { id: "cron"});
        }
    });

    const removeScheduleMutation = useMutation({
        mutationFn: RemoveWorkflowSchedule,
        onSuccess: () => {
            toast.success('Workflow schedule updated', { id: "cron"});
        },
        onError: () => {
            toast.error('Something went wrong', { id: "cron"});
        }
    });

    useEffect(() => {
        try {
            parser.parseExpression(cron);
            const humanCronStr = cronstrue.toString(cron);
            setValidCron(true);
            setReadableCron(humanCronStr);
        } catch (error) {
            console.log("SchedulerDialog error", error);
            setValidCron(false);
        }
    }, [cron]);

    const workflowHasValidCron = props.cron !== null && props.cron.length > 0;
    const readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant='link' 
                    size='sm' 
                    className={cn("text-sm p-0 h-auto text-orange-500", workflowHasValidCron && 'text-primary')}
                >
                    {workflowHasValidCron && (
                        <div className='flex items-center gap-2'>
                            <ClockIcon size={12} className='w-3 h-3' />
                            {readableSavedCron}
                        </div>
                    )}
                    {!workflowHasValidCron && (
                        <div className='flex items-center gap-1'>
                            <TriangleAlertIcon size={12} className='w-3 h-3' />
                            Set schedule
                        </div>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className='px-0'>
                <CustomDialogHeader title='Schedule workflow execution' icon={CalendarIcon} />

                <div className='p-6 space-y-4'>
                    <p className='text-muted-foreground text-sm'>
                        Specify a cron expression to schedule periodic workflow execution. All times are in UTC.
                    </p>

                    <Input placeholder='0 0 * * *' value={cron} onChange={(e) => setCron(e.target.value)} />

                    <div className={cn('bg-accent rounded-md p-4 border text-sm border-destructive text-destructive', validCron && 'border-primary text-primary')}>
                        {validCron ? readableCron : 'Not a valid cron expression'}
                    </div>

                    {workflowHasValidCron && (
                        <DialogClose asChild>
                            <div className='px-8'>
                                <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='w-full text-destructive border-destructive hover:text-destructive' 
                                    onClick={() => {
                                        toast.loading('Removing schedule...', { id: "cron"});
                                        removeScheduleMutation.mutate(props.workflowId);
                                    }}
                                    disabled={removeScheduleMutation.isPending || mutate.isPending}
                                >
                                    Remove current schedule
                                </Button>
                                <Separator className='my-4' />
                            </div>
                        </DialogClose>
                    )}
                </div>

                <DialogFooter className='px-6 gap-2'>
                    <DialogClose asChild>
                        <Button variant='secondary' className='w-full'>
                            Cancel
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button 
                            className='w-full' 
                            onClick={() => {
                                toast.loading('Saving...', { id: "cron"});
                                mutate.mutate({
                                    id: props.workflowId,
                                    cron
                                })
                            }} 
                            disabled={mutate.isPending || !validCron}
                        >
                            {mutate.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SchedulerDialog