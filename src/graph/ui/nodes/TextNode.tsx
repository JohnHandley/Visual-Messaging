import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node, useReactFlow} from '@xyflow/react';
import { useCallback, useState } from 'react';

import { extractTokensFromTemplate } from '../../liquid/process';
import { MessageProps } from '../../processing/nodes/message';

import styles from './style.module.css';
import { TextInputHandle } from './TextInputHandle';


export interface TextNodeData extends MessageProps, Record<string, unknown> {
  label: string;
}

export type TextNode = Node<TextNodeData, 'text'>;

function TextNodeComponent({
  id,
  data,
}: NodeProps<TextNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeData } = useReactFlow();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [override, _setOverride] = useState<Record<string, string>>({ format: "" });
  const [tokens, setTokens] = useState<string[]>([]);
  const [value, setValue] = useState("");

  // const onOverrideChange = (key: string) => useMemo(
  //   (v: string | null) => {
  //     setOverride({ ...override, [key]: v || "" })
  //   },
  //   []
  // )

  const onChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!event.target.value || event.target.value === value) {
      console.log('No change');
      return;
    }
    console.log('Change', event.target.value);
    setTokens(extractTokensFromTemplate(event.target.value))
    setValue(event.target.value);
    updateNodeData(id, { output: event.target.value });
    updateNodeInternals(id);
  }, [id, updateNodeData, updateNodeInternals, value]);

  return (
    <div className={styles.node}>
      <div className={`custom-drag-handle ${styles.header} ${styles["node-color"]} ${styles["pure-function-call"]} ${styles["gradient"]}`}>
        <div className={`${styles.icon} ${styles["pure-function-call"]}`} />
        <span className={`${styles["has-icon"]} ${styles["name"]}`}>{data.label}</span>
      </div>
      <div className={styles.body}>
        <div className={styles["left-col"]}>
          <div key={`${id}-container-key`} className={styles.pin}>
            <div key={`${id}-container-sub-key`} className={`${styles["div-inside"]} ${styles["wildcard"]}`}>
              <TextInputHandle id={`${id}-format`} label="format" onChange={() => {}}/>
              <br />
              {!override['format'] && <textarea 
                key={`${id}-text-key`}
                id={`${id}-text`}
                className={styles["text-input"]}
                placeholder={data.initial}
                onBlur={onChange}
              />}
            </div>
          </div>
          {
            Array.from({ length: tokens.length }).map((_, i) => (
              <div key={`${id}-container-${i}-key`} className={styles.pin}>
                <div key={`${id}-container-sub-${i}-key`} className={`${styles["div-inside"]} ${styles["wildcard"]}`}>
                  <TextInputHandle id={`${id}-${tokens[i]}`} label={tokens[i]} onChange={() => {}}/>
                  <br />
                  {!override[tokens[i]] && <input
                    key={`${id}-text-${i}-key`}
                    id={`${id}-text-${i}`}
                    type="text"
                    className={styles["text-input"]}
                    placeholder="test value"
                    onBlur={() => {}}
                  />}
                </div>
              </div>
            ))
          }
        </div>
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

export default TextNodeComponent;