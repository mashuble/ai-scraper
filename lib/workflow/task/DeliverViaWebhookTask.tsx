import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps, SendIcon, TextIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
    type: TaskType.DELIVER_VIA_WEBHOOK,
    label: 'Deliver via webhook',
    icon: (props: LucideProps) => <SendIcon className="stroke-blue-400" {...props} />,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: 'Target URL',
            type: TaskParamType.STRING,
            required: true
        },
        {
            name: 'Body',
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