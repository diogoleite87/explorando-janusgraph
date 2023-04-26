export type GraphNode = {
    id: string
    name: string
    age: number
    label: string
}

export type GraphLink = {
    source: string
    target: string
    label: string
}

export type GraphData = {
    nodes: GraphNode[]
    links: GraphLink[]
}

export type People = {
    id: number
    name: string
    age: number
    gender: string
    label: string
}

export type Country = {
    id: number
    name: string
}

export type City = {
    id: number
    name: string
}