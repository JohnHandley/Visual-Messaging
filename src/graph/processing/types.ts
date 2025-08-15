import { GetSchemes } from "rete";
import {
  Debug,
  Message,
  OnMessageAdd,
  Match,
  Send,
} from "./nodes";
import { Connection } from "./connection";

export interface DefaultProps {
  
}


export type NodeProps =
  | Debug
  | Message
  | OnMessageAdd
  | Match
  | Send;
export type ConnProps =
  | Connection<Message, Send>
  | Connection<Match, Send>
  | Connection<OnMessageAdd, Match>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;

export enum NodeType {
  Chat = 'Chat',
  Message = 'Message',
  OnMessage = 'OnMessage',
  Match = 'Match',
  Send = 'Send'
}