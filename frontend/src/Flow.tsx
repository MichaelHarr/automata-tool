import { 
    ReactFlow, 
    useOnSelectionChange,
    useReactFlow,
    Node as FlowNode,
    Edge as FlowEdge,
    Background
 } from "@xyflow/react";
import { useCallback, useRef } from "react";
import Node from "./Node";
import ContextMenu from "./ContextMenu";
import '@xyflow/react/dist/style.css';

const nodeTypes = {
    circleNode: Node
  };

interface CustomNodeData {
    label: string;
    initialState: boolean;
    finalState: boolean;
    [key: string]: string | boolean; 
}

interface CustomEdgeData {
    label: string;
    [key: string]: unknown;
}

interface FlowProps {
    nodes: FlowNode<CustomNodeData>[];
    edges: FlowEdge<CustomEdgeData>[];
    nodeName: string;
    setNodeName: (name: string) => void;
    selectedNodeId: string;
    setSelectedNodeId: (id: string) => void;
    edgeName: string;
    setEdgeName: (name: string) => void;
    selectedEdgeId: string;
    setSelectedEdgeId: (id: string) => void;
    inputString: string;
    onNodesChange: any;
    onEdgesChange: any;
    onConnect: any;
    onDragOver: any;
    onNodeContextMenu: any;
    menu: any;
    onPaneClick: any;
    setNodes: (updater: (nodes: FlowNode<CustomNodeData>[]) => FlowNode<CustomNodeData>[]) => void;
    ref: any;
}

function Flow({
    nodes,
    edges,
    setNodeName,
    setSelectedNodeId, 
    setEdgeName, 
    setSelectedEdgeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onNodeContextMenu,
    menu,
    onPaneClick,
    setNodes,
    ref,
    }: FlowProps) {

    const nodeIdCounter = useRef(nodes.length);

    const { screenToFlowPosition } = useReactFlow();

      const onDrop = useCallback((event: any) => {
          event.preventDefault();
    
          nodeIdCounter.current += 1;
          
          const position = screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
          });
    
          const newNode: FlowNode<CustomNodeData> = {
              id: crypto.randomUUID(),
              type: 'circleNode',
              position,
              data: { label: `Node ${nodeIdCounter.current}`, initialState: false, finalState: false },
          }
    
          setNodes((nds) => nds.concat(newNode));
      }, [screenToFlowPosition]);

    
    const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges } : { nodes: FlowNode<CustomNodeData>[], edges: FlowEdge<CustomEdgeData>[] }) => {
    
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
            fitView
        >
            <Background />
            {menu && <ContextMenu onClick={onPaneClick} {...menu}/>}
        </ReactFlow>
    );
}

export default Flow;