import { create } from 'zustand';
import {
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnConnectStartParams,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnConnectStart,
} from '@xyflow/react';

import { AppNode } from './graph/ui/nodes/types';
import { AppEdge } from './graph/ui/edges/types';

const initialNodes: AppNode[] = [
  {
    id: 'test-var',
    type: 'var',
    position: { x: 0, y: 0 },
    dragHandle: ".custom-drag-handle",
    data: { label: 'Test Variable', initial: 'derp' },
  },
  {
    id: 'test-formatter',
    type: 'text',
    position: { x: 400, y: 0 },
    dragHandle: ".custom-drag-handle",
    data: { label: 'Test Formatter', initial: 'derp' },
  }
];

const initialEdges: AppEdge[] = [
  { id: 'a->c', source: 'test-var', target: 'test-formatter', animated: true, type: 'text-edge', style: { strokeWidth: 2, stroke: 'blue' }},
];

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  connectionLineStyle: React.CSSProperties | undefined;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectStart: OnConnectStart;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateOverrides: (nodeId: string, overrideId: string, value: string) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  connectionLineStyle: {
    strokeWidth: 2,
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    console.log('ON EDGES CHANGE', changes);
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    console.log('ON CONNECT', connection);
    set({
      edges: addEdge({ ...connection, style: { stroke: 'blue'}}, get().edges),
    });
  },
  onConnectStart: (_: unknown, params: OnConnectStartParams) => {
    console.log('ON CONNECT START', params);
    const sourceNode = get().nodes.find((node) => node.id === params.nodeId);
    if (sourceNode?.style) {
      set({
        connectionLineStyle: {
          stroke: sourceNode.style.backgroundColor,
          strokeWidth: 2
        }
      });
    }
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  updateOverrides: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, data: { ...node.data, overrides: { ...node} } };
        }
        return node;
      }),
    });
  }
}));

export default useStore;