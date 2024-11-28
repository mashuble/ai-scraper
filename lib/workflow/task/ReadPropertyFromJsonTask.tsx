import { TaskParamType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps, TextIcon } from "lucide-react";

export const ReadPropertyFromJsonTask = {
    type: TaskType.READ_PROPERTY_FROM_JSON,
    label: 'Read property from JSON',
    icon: (props: LucideProps) => <TextIcon className="stroke-orange-400" {...props} />,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: 'JSON',
            type: TaskParamType.STRING,
            required: true
        },
        {
            name: 'Property name',
            type: TaskParamType.STRING,
            required: true
        },
    ] as const,
    outputs: [
        {
            name: 'Property value',
            type: TaskParamType.STRING
        }
    ] as const,
} satisfies WorkflowTask;