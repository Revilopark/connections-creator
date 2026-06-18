import { Node, Edge } from './graphData';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://twelve-grapes-build.loca.lt';

export interface APIPath {
  nodes: Node[];
  edges: Edge[];
  step_count: number;
  scores: {
    serendipity: number;
    curiosity: number;
    synchronicity: number;
    fortuity: number;
    materiality: number;
  };
}

export interface APIResponse {
  start: string;
  end: string;
  paths: APIPath[];
  path_count: number;
}

class ConnectionsAPI {
  private baseUrl: string;
  private isAvailable: boolean | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkAvailability(): Promise<boolean> {
    if (this.isAvailable !== null) return this.isAvailable;
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }

  async getNodes(): Promise<Node[]> {
    const response = await fetch(`${this.baseUrl}/api/graph/nodes`);
    if (!response.ok) throw new Error('Failed to fetch nodes');
    const data = await response.json();
    return data.nodes;
  }

  async findPaths(
    start: string,
    end: string,
    minSteps: number = 5,
    maxSteps: number = 10
  ): Promise<APIResponse> {
    const response = await fetch(`${this.baseUrl}/api/graph/path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end, min_steps: minSteps, max_steps: maxSteps }),
    });
    if (!response.ok) throw new Error('Failed to find paths');
    return response.json();
  }

  async getNode(nodeId: string): Promise<{ node: Node; connections: Edge[] }> {
    const response = await fetch(`${this.baseUrl}/api/graph/node/${nodeId}`);
    if (!response.ok) throw new Error('Failed to fetch node');
    return response.json();
  }

  get isUsingAPI(): boolean {
    return this.isAvailable === true;
  }
}

export const api = new ConnectionsAPI();
