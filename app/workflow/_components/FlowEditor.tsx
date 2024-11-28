import React, { useCallback, useEffect } from 'react'
import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, Node, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/NodeComponent'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/tasks'
import { AppNode } from '@/types/appNode'
import DeletableEdge from './edges/DeletableEdge'
import { TaskRegistry } from '@/lib/workflow/task/registry'

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
}

const edgeTypes = {
    default: DeletableEdge,
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

    useEffect(() => {
        try {
            console.log('FlowEditor FlowEditor', workflow.definition);
            const flow = JSON.parse(workflow.definition);
            if(!flow) return;

            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);

            if(!flow.viewport) return;

            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) {
            console.error(error);
        }
    }, [workflow.definition, setNodes, setEdges, setViewport]);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskType = e.dataTransfer.getData('application/reactflow');

        if(typeof taskType === undefined || !taskType) return;

        const position = screenToFlowPosition({
            x: e.clientX, 
            y: e.clientY
        });

        const newNode = CreateFlowNode(taskType as TaskType, position);
        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({...connection, animated: true}, eds));

        if(!connection.targetHandle) return;

        // Remove input value if is present on connection
        const node = nodes.find((node) => node.id === connection.target);

        if(!node) return;
        
        const nodeInputs = node.data.inputs;
        delete nodeInputs[connection.targetHandle];
        updateNodeData(node.id, { inputs: nodeInputs });
    }, [setEdges, nodes, updateNodeData]);

    const isValidConnection = useCallback((connection: Edge | Connection) => {
        // No self connection allowed
        if(connection.source === connection.target) return false;

        // Same taskParam type connection
        const sourceNode = nodes.find((node) => node.id === connection.source);
        const targetNode = nodes.find((node) => node.id === connection.target);

        if(!sourceNode || !targetNode) {
            console.error('sourceNode || !targetNode', sourceNode, targetNode);
            return false
        }

        const sourceTask = TaskRegistry[sourceNode.data.type];
        const targetTask = TaskRegistry[targetNode.data.type];

        const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);
        const input = targetTask.inputs.find((input) => input.name === connection.targetHandle);

        if(input?.type !== output?.type) {
            return false;
        }

        const hasCycle = (node: AppNode, visited = new Set()) => {
            if(visited.has(node.id)) return false;
            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
                if(outgoer.id === connection.source) return true;
                if(hasCycle(outgoer, visited)) return true;
            }
        };

        const detectedCycle = hasCycle(targetNode);
        return !detectedCycle;
    }, [nodes]);

    return (
        <main className='h-full w-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapToGrid
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
            >
                <Controls position='top-left' fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor