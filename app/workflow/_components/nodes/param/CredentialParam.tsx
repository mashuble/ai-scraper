"use client"

import { ParamProps } from '@/types/appNode';
import React, { useId, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label';
import { SelectLabel } from '@radix-ui/react-select';
import { GetCredentialsForUser } from '@/actions/credentials/GetCredentialsForUser';
import { useQuery } from '@tanstack/react-query';

function CredentialParam({ param, updateNodeParamValue, value }: ParamProps) {
    const id = useId();

    const query = useQuery({
        queryKey: ['credentials-for-user'],
        queryFn: () => GetCredentialsForUser(),
        refetchInterval: 10000,
    })

    return (
        <div className='flex flex-col gap-1 w-full'>
            <Label htmlFor={id} className='text-xs flex'>
                <span>{param.name}</span>
                {param.required && <span className='text-red-500 px-2'>*</span>}
            </Label>
            <Select onValueChange={value => updateNodeParamValue(value)} defaultValue={value}>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select an option' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Credentials</SelectLabel>
                        {query.data?.map((credential: Credential) => (
                            <SelectItem key={credential.id} value={credential.id}>{credential.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default CredentialParam