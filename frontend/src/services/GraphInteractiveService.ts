import { Api } from "../providers";
import { GraphData } from "../schemas";

const getExpandInteractiveGraph = (id: number) => Api.get<GraphData>(`/interactive/${id}`)

export const GraphInteractiveService = {
    getExpandInteractiveGraph
}