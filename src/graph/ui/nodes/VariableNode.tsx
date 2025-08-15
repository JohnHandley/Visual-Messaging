import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node, useReactFlow} from '@xyflow/react';
import { useCallback, useState } from 'react';

import { extractTokensFromTemplate } from '../../liquid/process';
import { MessageProps } from '../../processing/nodes/message';

import styles from './style.module.css';
import { TextInputHandle } from './TextInputHandle';


export interface VariableNodeData extends MessageProps, Record<string, unknown> {
  label: string;
}

export type VariableNode = Node<VariableNodeData, 'var'>;

function VariableNodeComponent({
  id,
  data,
}: NodeProps<VariableNode>) {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState("");

  const onChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!event.target.value || event.target.value === value) {
      console.log('No change');
      return;
    }
    console.log('Change', event.target.value);
    setValue(event.target.value);
    updateNodeData(id, { output: event.target.value });
  }, [id, updateNodeData, value]);

  return (
    <div className={styles.node}>
      <div className={`custom-drag-handle ${styles.header} ${styles["node-color"]} ${styles["pure-function-call"]} ${styles["gradient"]}`}>
        <div className={`${styles.icon} ${styles["pure-function-call"]}`} />
        <span className={`${styles["has-icon"]} ${styles["name"]}`}>{data.label}</span>
      </div>
      <div className={styles.body}>
        <div className={styles["right-col"]}>
          <div key={`${id}-container-output-key`} className={styles.pin}>
            <div key={`${id}-container-sub-output-key`} className={`${styles["div-inside"]} ${styles["wildcard"]}`}>
              <label
                key={`${id}-label-output-key`}
                className={styles["label-text"]}
                htmlFor="output"
              >
                Output
              </label>
              <Handle
                type="source"
                className={`${styles["clink"]} ${styles["connector"]} ${styles["wildcard"]}`}
                position={Position.Right}
                id="output"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariableNodeComponent;