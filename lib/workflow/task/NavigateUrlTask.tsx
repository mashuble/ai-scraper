import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, Link2Icon, LucideProps, TextIcon } from "lucide-react";

export const NavigateUrlTask = {
    type: TaskType.NAVIGATE_URL,
    label: 'Navigate URL',
    icon: (props: LucideProps) => <Link2Icon className="stroke-orange-400" {...props} />,
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: 'Web Page',
            type: TaskParamType.BROWSER_INSTANCE,
            required: true
        },
        {
            name: 'URL',
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