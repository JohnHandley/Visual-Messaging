import { ClassicPreset } from "rete";
import { ActionSocket, TextSocket } from "../sockets";

export class OnMessageAdd extends ClassicPreset.Node<
  Record<string, never>,
  { exec: ClassicPreset.Socket; text: ClassicPreset.Socket },
  Record<string, never>
> {
  width = 180;
  height = 135;
  inputMessage?: string;

  constructor() {
    super("On message add");
    this.addOutput(
      "exec",
      new ClassicPreset.Output(new ActionSocket(), "Exec")
    );
    this.addOutput("text", new ClassicPreset.Output(new TextSocket(), "Text"));
  }

  execute(_: never, forward: (output: "exec") => void) {
    console.debug('OnMessageAdded: Executing: ' + this.inputMessage);
    forward("exec");
  }

  data() {
    return {
      text: this.inputMessage || ""
    };
  }
}
