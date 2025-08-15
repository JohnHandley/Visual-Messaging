import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';

import '@xyflow/react/dist/style.css';

import { edgeTypes } from './graph/ui/edges';
import { nodeTypes } from './graph/ui/nodes';

import useStore, { AppState } from './state';

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  connectionLineStyle: state.connectionLineStyle,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onConnectStart: state.onConnectStart,
});

export default function App() {
  const {
    nodes,
    edges,
    connectionLineStyle,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart
  } = useStore(useShallow(selector));

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectStart={onConnectStart}
      connectionLineStyle={connectionLineStyle}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
