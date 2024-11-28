'use client';

import React, { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { Layers2Icon, Loader2, ShieldEllipsisIcon } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCredentialSchema, CreateCredentialSchemaType } from '@/schema/credential';
import { CreateCredential } from '@/actions/credentials/CreateCredential';

function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {
            name: '',
            value: '',
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: () => {
            setOpen(false);
            form.reset();
            toast.success('Credential created successfully', {
                id: 'create-credential',
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: 'create-credential',
            });
        }
    });

    const onSubmit = useCallback((values: CreateCredentialSchemaType) => {
        toast.loading('Creating credential...', {
            id: 'create-credential',
        });
        mutate(values);
    }, [mutate]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create"}</Button>
            </DialogTrigger>
            <DialogContent>
                <CustomDialogHeader 
                    icon={ShieldEllipsisIcon} 
                    title='Create Credential'
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
                                            Enter a unique a descriptive name for the credential.<br/>
                                            This name will be used to identify the credential.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            Value
                                            <p className="text-xs text-primary">
                                                (required)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" placeholder="Workflow description" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the value associated with the credential. <br/>
                                            This value will be securely encrypted and stored in our database.
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

export default CreateCredentialDialog