"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { ParamProps } from '@/types/appNode';
import React, { useId, useState } from 'react'

function BrowserInstanceParam({ param }: ParamProps) {
    return (
        <p className='text-xs'>
            {param.name}
        </p>
    );
}

export default BrowserInstanceParam