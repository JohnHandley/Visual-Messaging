import {
  getStraightPath,
  BaseEdge,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';

export type TextEdge = Edge<{ value: string }, 'text-edge'>;

export default function TextEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<TextEdge>) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge id={id} path={edgePath} />;
}