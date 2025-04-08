import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

interface ContextMenuProps {
    id: string;
    top: number;
    left: number;
    onClick?: () => void;
}

export default function ContextMenu({ id, top, left, ...props }: ContextMenuProps) {
    const { setNodes, setEdges } = useReactFlow();

    const deleteNode = useCallback(() => {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    }, [id, setNodes, setEdges]);

    const toggleInitialState = useCallback(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const newValue = !node.data.initialState;
                    console.log(`Setting node ${id} initial state to: ${newValue}`);
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            initialState: !node.data.initialState,
                        },
                    };
                }
                return {
                    ...node,
                    data: {
                        ...node.data,
                        initialState: false,
                    }
                }
            }),
        );
    }, [id, setNodes]);

    const toggleFinalState = useCallback(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            finalState: !node.data.finalState,
                        },
                    };
                }
                return node;
            }),
        );
    }, [id, setNodes]);

    return (
        <div
          style={{ 
            top,
            left,
            position: 'absolute',}}
          className="z-10 bg-white rounded-lg shadow-lg w-64 dark:bg-gray-700 overflow-hidden"
          {...props}
        >
        <div className="p-3 border-b border-gray-200 dark:border-gray-600">
          <p className="text-base font-large">
            Node: {id}
          </p>
        </div>
          <div className="p-2 space-y-1">
            <button onClick={toggleInitialState} className="w-full text-left p-2 text-base hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md">
                Toggle Initial State
            </button>
            <button onClick={toggleFinalState} className="w-full text-left p-2 text-base hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md">
                Toggle Final State
            </button>
            <button onClick={deleteNode} className="w-full text-left p-2 text-base hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md">
                Delete
            </button>
          </div>
        </div>
      );
}