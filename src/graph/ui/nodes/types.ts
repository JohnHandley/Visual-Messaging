import { type Node } from '@xyflow/react';

import { type TextNode } from "./TextNode";
import { type VariableNode } from './VariableNode';

export type AppNode = Node | TextNode | VariableNode;