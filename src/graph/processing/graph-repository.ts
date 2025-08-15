import fs from 'fs/promises';
import path from 'path';
import { NodeType } from './types';

// Define an interface for the data model
export interface Graph {
  nodes: Record<string, Record<string, any>>,
  connections: Array<{
    source: string,
    sType: NodeType,
    sourceSocket: string,
    target: string,
    tType: NodeType,
    targetSocket: string
  }>
}

// Define the repository interface
interface GraphRepository {
  findById(id: string): Promise<Graph | null>;
}

// Implement the repository
export class FileGraphRepository implements GraphRepository {
  private dataPath: string;

  constructor(dataPath: string) {
    this.dataPath = dataPath;
  }

  async findById(id: string): Promise<Graph | null> {
    try {
      const filePath = path.join(this.dataPath, `${id}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const graph: Graph = JSON.parse(data);
      return graph;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null; // File not found, graph doesn't exist
      }
      throw error; // Re-throw other errors
    }
  }
}
