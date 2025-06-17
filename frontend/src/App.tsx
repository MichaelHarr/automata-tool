import './index.css'
import Flow from './Flow';
import SaveModal from './SaveModal';
import LoadModal from './LoadModal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlowProvider, 
        useEdgesState, 
        useNodesState,
        Node as FlowNode,
        Edge as FlowEdge,
        MarkerType,
        addEdge, } from '@xyflow/react';

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

const initialNodes: FlowNode<CustomNodeData>[] = [
    {
      id: '1',
      type: 'circleNode',
      data: { label: 'Node 1', initialState: false, finalState: false },
      position: { x: -200, y: 25 },
    },
   
    {
      id: '2',
      type: 'circleNode',
      data: { label: 'Node 2', initialState: false, finalState: false },
      position: { x: 0, y: 125 },
    },
    {
      id: '3',
      type: 'circleNode',
      data: { label: 'Node 3', initialState: false, finalState: false },
      position: { x: 150, y: 25 },
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

function App() {

  const [nodeName, setNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [edgeName, setEdgeName] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState('');
  
  const [isSaveModelOpen, setIsSaveModelOpen] = useState(false);
  const [isLoadModelOpen, setIsLoadModelOpen] = useState(false);

  const [inputString, setInputString] = useState('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode<CustomNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge<CustomEdgeData>>(initialEdges);

  const currentAutomaton = { nodes, edges }

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  const [menu, setMenu] = useState<MenuType | null>(null);
  const ref = useRef<HTMLInputElement>(null);

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
  
  const onDragOver = useCallback((event: any) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
  }, []);

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

  const onDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', 'circleNode');
  }, []);

  const checkInputString = useCallback((input: string) => {
    console.log("Input String:", input);
    console.log("Nodes:", nodes);
    let currentNode = nodes.find(node => node.data.initialState);

    let transitionFound: boolean = true;

    for (let i = 0; i < input.length; i++) {

        const transition = edges.find(edge => edge.source === currentNode?.id && edge.label === input[i]);

        if (transition) {
          currentNode = nodes.find(node => node.id === transition.target);
          transitionFound = true;
        } else {
          console.log("No transition found for input:", input[i]);
        }
    }

    const isAccepted = transitionFound && currentNode?.data.finalState;
    setIsValid(isAccepted ?? false);
    console.log(isAccepted ? "Accepted" : "Not Accepted");


  }, [nodes, edges]);

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

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  return (
    <>
    <h1 className="text-5xl font-bold text-black p-5">
      Automata Simulator
    </h1>
    <div className="relative w-full h-screen bg-gray-900 flex">
      <div className="w-1/4 border-r border-gray-300 p-4 text-white">
        <div className="flex flex-col gap-4">
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onDragStart={(event) => onDragStart(event)} draggable>
            Add Node
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsSaveModelOpen(true)}>
            Save Automaton
          </button>
            <input
              type="text"
              placeholder="Input String"
              className={`border border-gray-300 p-2 rounded ${isValid ? 'bg-green-800' : 'bg-transparent'}`}
              value={inputString}
              onChange={(event) => setInputString(event.target.value)}
            />
            <button onClick={() => checkInputString(inputString)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Test
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Remove
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsLoadModelOpen(true)}>
              Load Automaton
            </button>
          </div>
          { selectedNodeId && (
            <div>
              <h2 className="text-lg font-bold">Node Controls</h2>
              <label className="text-lg font-bold pr-1">Label:</label>
              <input
                value={nodeName}
                onChange={(evt) => setNodeName(evt.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div> 
          )}

          { selectedEdgeId && (
            <div>
              <h2 className="text-lg font-bold">Transition Controls</h2>
              <label className="text-lg font-bold pr-1">Label:</label>
              <input
                value={edgeName}
                onChange={(evt) => setEdgeName(evt.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
          )}
        </div>
      
      <ReactFlowProvider>
        <Flow 
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeName={nodeName}
            setNodeName={setNodeName}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            edgeName={edgeName}
            setEdgeName={setEdgeName}
            selectedEdgeId={selectedEdgeId}
            setSelectedEdgeId={setSelectedEdgeId}
            inputString={inputString}
            onConnect={onConnect}
            onDragOver={onDragOver}
            setNodes={setNodes}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={onPaneClick}
            menu={menu}        
          />
      </ReactFlowProvider>
    </div>
    { isSaveModelOpen && (
      <SaveModal 
        onClose={() => setIsSaveModelOpen(false)} 
        automatonData={currentAutomaton}
      >
      </SaveModal>
    )}
    { isLoadModelOpen && (
      <LoadModal 
        onClose={() => setIsLoadModelOpen(false)} 
      >
      </LoadModal>
    )}
  </>
  )
}

export default App