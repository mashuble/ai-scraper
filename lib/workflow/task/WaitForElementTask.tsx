import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps, TextIcon } from "lucide-react";

export const WaitForElementTask = {
    type: TaskType.WAIT_FOR_ELEMENT,
    label: 'Wait for element',
    icon: (props: LucideProps) => <TextIcon className="stroke-amber-400" {...props} />,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: 'Web Page',
            type: TaskParamType.BROWSER_INSTANCE,
            required: true
        },
        {
            name: 'Selector',
            type: TaskParamType.STRING,
            required: true
        },
        {
            name: 'Visibility',
            type: TaskParamType.SELECT,
            hideHandle: true,
            options: [
                {
                    label: 'Visible',
                    value: 'visible'
                },
                {
                    label: 'Hidden',
                    value: 'hidden'
                }
            ],
            required: true
        },
    ] as const,
    outputs: [
        {
            name: 'Web page',
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask;