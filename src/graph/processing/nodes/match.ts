import { ClassicPreset } from "rete";
import { DataflowEngine } from "rete-engine";
import { ActionSocket, TextSocket } from "../sockets";
import { DefaultProps, Schemes } from "../types";

export interface MatchProps extends DefaultProps {
    pattern: string
    dataflow: DataflowEngine<Schemes>
}

export class Match extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; text: ClassicPreset.Socket },
  { consequent: ClassicPreset.Socket; alternate: ClassicPreset.Socket },
  { regexp: ClassicPreset.InputControl<"text"> }
> {
  width = 180;
  height = 245;
  private dataflow: DataflowEngine<Schemes>;

  constructor({ dataflow, pattern }: MatchProps) {
    super("Match");
    this.addInput(
      "exec",
      new ClassicPreset.Input(new ActionSocket(), "Action")
    );
    this.addInput("text", new ClassicPreset.Input(new TextSocket(), "Text"));
    this.addControl(
      "regexp",
      new ClassicPreset.InputControl("text", { initial: pattern })
    );
    this.addOutput(
      "consequent",
      new ClassicPreset.Output(new ActionSocket(), "True")
    );
    this.addOutput(
      "alternate",
      new ClassicPreset.Output(new ActionSocket(), "False")
    );
    this.dataflow = dataflow;
  }

  async execute(
    _: never,
    forward: (output: "consequent" | "alternate") => void
  ) {
    const data = await this.dataflow.fetchInputs(this.id);
    const text = (data.text && data.text[0]) || "";
    const regexpStr = this.controls.regexp.value;

    if (!text || !regexpStr) return;

    if (text.match(new RegExp(regexpStr, "gi"))) {
      console.debug("Matched");
      forward("consequent");
    } else {
      console.debug("Not matched");
      forward("alternate");
    }
  }

  data() {
    return {};
  }
}
