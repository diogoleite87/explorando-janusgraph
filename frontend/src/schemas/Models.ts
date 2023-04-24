export type GraphNode = {
    id: string;
    name: string;
    age: number;
    label: string;
}

export type GraphLink = {
    source: string;
    target: string;
}

export type GraphData = {
    nodes: GraphNode[],
    links: GraphLink[]
}