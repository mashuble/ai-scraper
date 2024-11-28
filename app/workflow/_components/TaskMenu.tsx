'use client'

import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { TaskType } from '@/types/tasks'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CoinsIcon } from 'lucide-react'

function TaskMenu() {
  return (
    <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
        <Accordion type='multiple' className='w-full' defaultValue={['extraction', 'interactions', 'timing', 'storage', 'results']}>
            <AccordionItem value='interactions'>
                <AccordionTrigger className='font-bold'>User Interactions</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                    <TaskMenuBtn taskType={TaskType.NAVIGATE_URL} />
                    <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                    <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
                    <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='extraction'>
                <AccordionTrigger className='font-bold'>Data Extraction</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                    <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='storage'>
                <AccordionTrigger className='font-bold'>Data storage</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                    <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
                    <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='timing'>
                <AccordionTrigger className='font-bold'>Timing controls</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                    <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='results'>
                <AccordionTrigger className='font-bold'>Results</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                    <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </aside>
  )
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType];
    const onDragStart = (e: React.DragEvent<HTMLButtonElement>, type: TaskType) => {
        e.dataTransfer.setData('application/reactflow', type);
        e.dataTransfer.effectAllowed = 'move';
    }

    return <Button 
        variant='secondary' 
        size='sm' 
        className='flex justify-between items-center gap-2 border w-full' 
        draggable 
        onDragStart={(e) => onDragStart(e, taskType)}
    >
        <div className='flex gap-2'>
            <task.icon size={20} />
            {task.label}
        </div>
        {/* <Badge className='gap-2 flex items-center'>
            <CoinsIcon size={16} />
            {task.credits}
        </Badge> */}
    </Button>
}

export default TaskMenu