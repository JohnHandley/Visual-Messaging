import { ClassicPreset } from "rete";
import { DataflowEngine } from "rete-engine";
import { ActionSocket, TextSocket } from "../sockets";
import { Schemes } from "../types";

export class Send extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; text: ClassicPreset.Socket },
  Record<string, never>,
  Record<string, never>
> {
  width = 180;
  height = 135;

  constructor(
    private dataflow: DataflowEngine<Schemes>,
    private respond: (text: string) => void
  ) {
    super("Send");
    this.addInput(
      "exec",
      new ClassicPreset.Input(new ActionSocket(), "Action")
    );
    this.addInput("text", new ClassicPreset.Input(new TextSocket(), "Text"));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_: never, _forward: (output: "exec") => void) {
    const inputs = await this.dataflow.fetchInputs(this.id);
    const text = (inputs.text && inputs.text[0]) || "";

    this.respond(text);
  }

  data() {
    return {};
  }
}
