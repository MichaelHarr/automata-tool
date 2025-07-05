import { memo } from 'react';
import { Handle, Position } from "@xyflow/react";

interface NodeProps {
  data: {
    initialState: boolean;
    finalState: boolean;
    label: string;
    highlighted?: boolean;
  };
  isConnectable: boolean;
}

const Node = ({ data, isConnectable }: NodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="bg-gray-700"
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div
        className={`w-15 h-15 rounded-full border border-pink flex justify-center items-center ${data.highlighted ? 'bg-blue-300' : data.initialState ? 'bg-green-300' : 'bg-white'}`}
        data-testid="testNode"
      >
        <div className={`w-13 h-13 rounded-full border flex items-center justify-center ${data.finalState ? 'border-black' : 'border-transparent'} border-[0.08em]`}>
          <span className="text-sm font-xs">{data.label}</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="bg-gray-700"
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(Node);
