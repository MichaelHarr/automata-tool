import { 
    addEdge, 
    MarkerType, 
    ReactFlow, 
    useEdgesState, 
    useNodesState,
    useOnSelectionChange,
    useReactFlow,
    Node as FlowNode,
    Edge as FlowEdge,
    Background
 } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Node from "./Node";
import ContextMenu from "./ContextMenu";
import '@xyflow/react/dist/style.css';

const nodeTypes = {
    circleNode: Node
  };

interface CustomNodeData {
    label: string;
    otherProperty?: string;
    [key: string]: string | undefined; 
}

interface CustomEdgeData {
    label: string;
    [key: string]: unknown;
}

const initialNodes: FlowNode<CustomNodeData>[] = [
    {
      id: '1',
      type: 'circleNode',
      data: { label: 'Node 1' },
      position: { x: 250, y: 25 },
    },
   
    {
      id: '2',
      type: 'circleNode',
      data: { label: 'Node 2' },
      position: { x: 100, y: 125 },
    },
    {
      id: '3',
      type: 'circleNode',
      data: { label: 'Node 3' },
      position: { x: 250, y: 250 },
    },
];
   
const initialEdges: FlowEdge<CustomEdgeData>[] = [
    { 
        id: 'e1-2', 
        source: '1', 
        target: '2', 
        animated: true, 
        markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20},     
        label: '1'
    },
    { 
        id: 'e2-3',     
        source: '2', 
        target: '3', 
        animated: true, 
        markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20},
        label: '0'
    }
];

interface MenuType {
    id: string;
    top: number;
    left: number;
}

interface FlowProps {
    nodeName: string;
    setNodeName: (name: string) => void;
    selectedNodeId: string;
    setSelectedNodeId: (id: string) => void;
    edgeName: string;
    setEdgeName: (name: string) => void;
    selectedEdgeId: string;
    setSelectedEdgeId: (id: string) => void;
    inputString: string;
    setTestStringFunction: (fn: (inputString: string) => boolean) => void;
}

function Flow({
    nodeName, 
    setNodeName,
    selectedNodeId, 
    setSelectedNodeId, 
    edgeName, 
    setEdgeName, 
    selectedEdgeId, 
    setSelectedEdgeId,
    inputString,
    setTestStringFunction
    }: FlowProps) {

    const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode<CustomNodeData>>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge<CustomEdgeData>>(initialEdges);

    const nodeIdCounter = useRef(nodes.length);

    const [menu, setMenu] = useState<MenuType | null>(null);
    const ref = useRef<HTMLInputElement>(null);
    
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(
        (connection: any) => {
            const newEdge = {
                ...connection,
                markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20},
                animated: true,
                label: '0',
            }
            setEdges((eds) => addEdge(newEdge, eds))
        },
        [setEdges]
    );
    
    const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges } : { nodes: FlowNode<CustomNodeData>[], edges: FlowEdge<CustomEdgeData>[] }) => {
        setMenu(null)

        if (selectedNodes && selectedNodes.length > 0) {
            const node = selectedNodes[0];
            setSelectedNodeId(node.id);
            setNodeName(node.data.label);
        } else {
            setSelectedNodeId('')
            setNodeName('')
        }

        if (selectedEdges && selectedEdges.length > 0) {
            const edge = selectedEdges[0];
            setSelectedEdgeId(edge.id);
            setEdgeName(edge.label?.toString() || '');
        } else {
            setSelectedEdgeId('')
            setEdgeName('')
        }

    }, [setSelectedNodeId, setNodeName, setSelectedEdgeId, setEdgeName]);

    useOnSelectionChange({
        onChange: onSelectionChange
    });
    
    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: any) => {
        event.preventDefault();

        nodeIdCounter.current += 1;
        
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode = {
            id: crypto.randomUUID(),
            type: 'circleNode',
            position,
            data: { label: `Node ${nodeIdCounter.current}` },
        }

        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition]);

    const onNodeContextMenu = useCallback(
        (event: any, node: any) => {
            event.preventDefault();

            const pane = ref.current?.getBoundingClientRect();

            console.log("Pane", pane);
            if (!pane) return;

            const x = event.clientX - pane.left;
            const y = event.clientY - pane.top;

            setMenu({
                id: node.id,
                top: y,
                left: x,
            })
        }, [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    // Update node label when nodeName changes
    useEffect(() => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === selectedNodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: nodeName,
                },
              };
            }
     
            return node;
          }),
        );
      }, [setNodes, nodeName, selectedNodeId]);

    // Update edge label when edgeName changes
    useEffect(() => {
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.id === selectedEdgeId) {
              return {
                ...edge,
                label: edgeName
              };
            }
            return edge;
          }),
        );
      }, [setEdges, edgeName, selectedEdgeId]);

    return (
        <ReactFlow 
            ref={ref}
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeContextMenu={onNodeContextMenu}   
            onPaneClick={onPaneClick}
            fitView
        >
            <Background />
            {menu && <ContextMenu onClick={onPaneClick} {...menu}/>}
        </ReactFlow>
    );
}

export default Flow;