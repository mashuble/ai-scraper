"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/appNode';
import React, { useEffect, useId, useState } from 'react'

function StringParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
    const [internalValue, setInternalValue] = useState(value ?? '');
    const id = useId();
    
    useEffect(() => {
        setInternalValue(value ?? '');
    }, [value]);

    let Component: any = Input;

    if(param.variant === 'textarea') {
        Component = Textarea;
    }

    return (
        <div className='space-y-1 p-1 w-full'>
            <Label htmlFor={id} className='text-xs flex'>
                {param.name}
                {param.required && <span className='text-red-400 px-2'>*</span>}
            </Label>
            <Component 
                id={id} 
                className='text-xs'
                value={internalValue} 
                onChange={(e: any) => setInternalValue(e.target.value)} 
                placeholder={param.placeholder} 
                onBlur={() => updateNodeParamValue(internalValue)}
                disabled={disabled}
            />
            {param.helperText && <p className='px-2 text-muted-foreground'>{param.helperText}</p>}
        </div>
    );
}

export default StringParam