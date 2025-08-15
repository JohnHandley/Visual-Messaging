import { NodeEditor } from "rete";
import { DataflowEngine, ControlFlowEngine } from "rete-engine";
import readline from 'readline';

import {
  Debug,
  Message,
  OnMessageAdd,
  Match,
  Send,
} from "./nodes";
import { ActionSocket, TextSocket } from "./sockets";
import { NodeProps, NodeType, Schemes } from "./types";
import { Connection } from "./connection";
import { getConnectionSockets } from "./utils";
import { FileGraphRepository } from "./graph-repository";

export async function initEngine(log: (text: string, type: "info" | "error") => void) {
  const editor = new NodeEditor<Schemes>();
  const dataflow = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof TextSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof TextSocket)
          .map(([name]) => name),
    };
  });
  const engine = new ControlFlowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof ActionSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof ActionSocket)
          .map(([name]) => name),
    };
  });

  editor.use(engine);
  editor.use(dataflow);

  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editor, data);

      if (!source.isCompatibleWith(target)) {
        log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });
  
  return { 
    editor,
    dataflow,
    engine
  }
}

export async function create(
  log: (message?: any, ...optionalParams: any[]) => void
) {
  const { editor, dataflow, engine } = await initEngine(log);

  const nodes: Record<string, Map<string, NodeProps>> = {
    OnMessage: new Map<string, OnMessageAdd>(),
    Match: new Map<string, Match>(),
    Message: new Map<string, Message>(),
    Send: new Map<string, Send>(),
    Chat: new Map<string, Debug>()
  }

  const listeners: Debug[] = [];
  const emit = (text: string, type: 'bot' | 'user') => {
    listeners.forEach(l => type === 'bot' ? l.botSend(text) : l.userSend(text));
  }

  const graphRepo = new FileGraphRepository('./data/graphs');
  const graph = await graphRepo.findById('test');
  if (!graph) {
    log('graph not found');
    return;
  }

  const { nodes: persistedNodes, connections: persistedConnections } = graph;

  for(const type of Object.keys(nodes)) {
    for(const node of Object.keys(persistedNodes[type])) {
      switch(type) {
        case NodeType.OnMessage:
          console.debug('Creating OnMessageAdd node');
          nodes[type].set(node, new OnMessageAdd({ dataflow }));
          break;
        case NodeType.Match:
          console.debug('Creating Match node');
          nodes[type].set(node, new Match({ dataflow, ...persistedNodes[type][node]}));
          break;
        case NodeType.Message:
          console.debug('Creating Message node');
          nodes[type].set(node, new Message({ dataflow, ...persistedNodes[type][node]}));
          break;
        case NodeType.Send:
          console.debug('Creating Send node');
          nodes[type].set(node, new Send(dataflow, (text: string) => {
            setTimeout(() => {
              emit(text, 'bot');
            }, 500);
          }));
          break;
        case NodeType.Chat:
          console.debug('Creating Debug node');
          const newDebug = new Debug((message) => {
            log(`${message.own ? 'user' : 'bot'} > ${message.message}`);
            if (message.own) {
              const onMessage = editor
                .getNodes()
                .filter((n): n is OnMessageAdd => n instanceof OnMessageAdd);
              dataflow.reset();
        
              for (const node of onMessage) {
                console.debug('Handling Message: ' + message.message + ' with node: ' + node.label);
                node.inputMessage = message.message;
                engine.execute(node.id);
              }
            }
          })
          nodes[type].set(node, newDebug);
          listeners.push(newDebug);
          break;
      }

      const exists = nodes[type].get(node)
      if(exists) {
        await editor.addNode(exists);
      }
    }
  }

  await Promise.all(persistedConnections.map(c => {
    console.debug('Creating connection', c);
    editor.addConnection(
      new Connection(
        nodes[c.sType].get(c.source) as any,
        c.sourceSocket,
        nodes[c.tType].get(c.target) as any,
        c.targetSocket
      )
    )
  }));

  emit(
    "Hello there! I'm a chatbot based on visual programming and built using the Rete.js framework",
    'bot'
  );
  emit("btw, check out the [Rete.js website](https://retejs.org)", 'bot');
  emit(
    "Additionally, you have the option to back my creator [on Patreon](https://www.patreon.com/bePatron?u=7890937)",
    'bot'
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    if (input) {
      emit(input, 'user');
    }
  });

  rl.on('close', () => {
    console.log('Chat ended');
  });
}

create(console.log)