import { NodeTypes } from "@xyflow/react";
import TextNodeComponent from "./TextNode";
import VariableNodeComponent from "./VariableNode";

export const nodeTypes = {
  'text': TextNodeComponent,
  'var': VariableNodeComponent,
} satisfies NodeTypes;
