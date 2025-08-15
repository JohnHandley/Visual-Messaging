import { Handle, Position } from "@xyflow/react";
import { useMemo } from "react";

import styles from './style.module.css';
import useStore, { AppState } from '../../../state';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export interface TextInputHandleProps {
  id: string;
  label: string;
  onChange: (value: string | null) => void;
}

export const TextInputHandle: React.FC<TextInputHandleProps> = ({ id, label, onChange }) => {
  const {
    nodes,
    edges,
  } = useStore(useShallow(selector));

  const computedId = `${id}-text-input-handle`;
  const connection = edges.find(edge => edge.targetHandle === computedId);
  const source = nodes.find(node => node.id === connection?.source);

  const text = connection?.sourceHandle && source?.data ? source.data[connection.sourceHandle] : '';

  useMemo(() => {
    if(connection) {
      if(typeof text !== 'string') {
        onChange(null);
      } else {
        onChange(text);
      }
    }
  }, [text, connection, onChange]);
 
  return (
    <>
      <Handle
        key={`${computedId}-key`}
        type="target"
        position={Position.Left}
        id={computedId}
        isValidConnection={() => false}
        className={`${styles["clink"]} ${styles["connector"]} ${styles["wildcard"]}`}
      />
      <label
        key={`${computedId}-label-key`}
        className={styles["label-text"]}
        htmlFor={computedId}
      >
        {label}
      </label>
    </>

  );
};