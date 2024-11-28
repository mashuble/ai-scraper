import { NodeProps } from "@xyflow/react"
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from '@/types/appNode';
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeInputs, NodeInput } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
const NodeComponent = memo((props: NodeProps) => {
    const { data: nodeData } = props;

    const task = TaskRegistry[(nodeData as AppNodeData).type];
    
    return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
        {DEV_MODE && <Badge>{props.id}</Badge>}
        <NodeHeader taskType={(nodeData as AppNodeData).type} nodeId={props.id} />
        <NodeInputs>
            {task.inputs.map((input) => (
                <NodeInput key={input.name} input={input} nodeId={props.id} />
            ))}
        </NodeInputs>

        <NodeOutputs>
            {task.outputs.map((output) => (
                <NodeOutput key={output.name} output={output} />
            ))}
        </NodeOutputs>
    </NodeCard>
})

export default NodeComponent
NodeComponent.displayName = 'NodeComponent'