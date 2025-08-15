import { ClassicPreset } from "rete";
import { TextSocket } from "../sockets";
import { DefaultProps } from "../types";

export interface MessageProps extends DefaultProps {
  initial: string
}

export class Message extends ClassicPreset.Node<
  Record<string, never>,
  { text: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"text"> }
> {
  width = 180;
  height = 140;

  constructor({ initial }: MessageProps) {
    super("Message");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("text", { initial })
    );
    this.addOutput("text", new ClassicPreset.Output(new TextSocket(), "Text"));
  }

  execute() {}

  data() {
    return {
      text: this.controls.value.value || ""
    };
  }
}
