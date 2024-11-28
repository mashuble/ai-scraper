'use client';

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

import React from 'react'
import { Separator } from './ui/separator';

interface CustomDialogHeaderProps {
    icon?: LucideIcon;
    title?: string;
    subTitle?: string;
    iconClassName?: string;
    titleClassName?: string;
    subTitleClassName?: string;
}

function CustomDialogHeader({ icon: Icon, title, subTitle, iconClassName, titleClassName, subTitleClassName }: CustomDialogHeaderProps) {
  return (
    <DialogHeader className="py-6 pb-2">
        <DialogTitle className={titleClassName}>
            <div className="flex flex-col items-center gap-2 mb-2">
                {Icon && <Icon size={30} className={cn('stroke-primary', iconClassName)} />}
                {Boolean(title) && (
                    <p className={cn('text-xl text-primary', titleClassName)}>
                        {title}
                    </p>
                )}
                {Boolean(subTitle) && (
                    <DialogDescription className={cn('text-sm text-muted-foreground', subTitleClassName)}>
                        {subTitle}
                    </DialogDescription>
                )}
            </div>
        </DialogTitle>
        <Separator />
    </DialogHeader>
  )
}

export default CustomDialogHeader