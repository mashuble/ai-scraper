import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: 'Get html from page',
    icon: (props: LucideProps) => <GlobeIcon className="stroke-rose-400" {...props} />,
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: 'Web page',
            type: TaskParamType.BROWSER_INSTANCE,
            helperText: 'eg: https://www.google.com',
            required: true
        },
    ] as const,
    outputs: [
        {
            name: 'Html',
            type: TaskParamType.STRING
        },
        {
            name: 'Web page',
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask