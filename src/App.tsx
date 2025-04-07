import './index.css'
import Flow from './Flow';
import React, { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

function App() {

  const [nodeName, setNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [edgeName, setEdgeName] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState('');

  const [inputString, setInputString] = useState('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [testStringFunction, setTestStringFunction] = useState<((inputString: string) => boolean) | null>(null);

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.effectAllowed = 'move';
  }

  const checkInputString = (inputString: string) => {
    console.log("Input String: ", inputString); 
  }

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
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Input String"
              className="border border-gray-300 p-2 rounded"
              value={inputString}
              onChange={(event) => setInputString(event.target.value)}
            />
            <button onClick={() => checkInputString(inputString)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Test
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Remove
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
      </div>
      <ReactFlowProvider>
        <Flow 
          nodeName={nodeName}
          setNodeName={setNodeName}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          edgeName={edgeName}
          setEdgeName={setEdgeName}
          selectedEdgeId={selectedEdgeId}
          setSelectedEdgeId={setSelectedEdgeId}
          inputString={inputString}
          setTestStringFunction={setTestStringFunction}
        />
      </ReactFlowProvider>
    </div>
  </>
  )
}

export default App