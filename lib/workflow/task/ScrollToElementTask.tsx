import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";

export const ScrollToElementTask = {
    type: TaskType.SCROLL_TO_ELEMENT,
    label: 'Scroll to element',
    icon: (props: LucideProps) => <ArrowUpIcon className="stroke-orange-400" {...props} />,
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
    ] as const,
    outputs: [
        {
            name: 'Web page',
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask;