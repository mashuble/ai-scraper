"use client"

import useFlowValidation from '@/components/hooks/useFlowValidation';
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import React from 'react'

interface NodeCardProps {
    children: React.ReactNode;
    nodeId: string;
    isSelected: boolean;
}

function NodeCard({ children, nodeId, isSelected }: NodeCardProps) {
    const { getNode, setCenter } = useReactFlow();
    const { invalidInputs } = useFlowValidation();
    const hasInvalidInputs = invalidInputs.some(node => node.nodeId === nodeId);

    return (
        <div
            onDoubleClick={() => {
                const node = getNode(nodeId);
                if (!node) return;  
                const { position, measured } = node;
                if(!position || !measured) return;
                const { width, height } = measured;
                const x = position.x + width! / 2;
                const y = position.y + height! / 2;

                if(x === undefined || y === undefined) return;

                setCenter(x, y, {
                    zoom: 1,
                    duration: 500,
                })
            }}
            className={cn(
                'bg-background rounded-md cursor-pointer border-2 border-separate w-[420px] text-xs gap-1 flex flex-col',
                isSelected && 'border-primary',
                hasInvalidInputs && 'border-destructive',
            )}
        >
            {children}
        </div>
    )
}

export default NodeCard