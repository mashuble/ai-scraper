'use client';

import React, { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { Layers2Icon, Loader2 } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useForm } from 'react-hook-form';
import { createWorkflowSchema, CreateWorkflowSchemaType } from '@/schema/workflow';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createWorkflow } from '@/actions/workflows/createWorkflow';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateWorkflowSchemaType>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createWorkflow,
        onSuccess: () => {
            setOpen(false);
            toast.success('Workflow created successfully', {
                id: 'create-workflow',
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: 'create-workflow',
            });
        }
    });

    const onSubmit = useCallback((values: CreateWorkflowSchemaType) => {
        mutate(values);
        toast.loading('Creating workflow...', {
            id: 'create-workflow',
        });
    }, [mutate]);

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            form.reset();
        }}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create Workflow"}</Button>
            </DialogTrigger>
            <DialogContent>
                <CustomDialogHeader 
                    icon={Layers2Icon} 
                    title='Create Workflow' 
                    subTitle='Start building your workflow.' 
                />
                <div className="p-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            Name
                                            <p className="text-xs text-primary">
                                                (required)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Workflow name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a descriptive and unique name for your workflow.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            Description
                                            <p className="text-xs text-primary">
                                                (optional)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" placeholder="Workflow description" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a brief description of your workflow.<br/>
                                            This is optional but can help you remember what the workflow is for.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {!isPending && 'Proceed'}
                                {isPending && <Loader2 className="animate-spin" />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkflowDialog