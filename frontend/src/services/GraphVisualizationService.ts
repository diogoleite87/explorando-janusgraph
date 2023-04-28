import { Api } from "../providers";
import { GraphData } from "../schemas";

const getVisualization = (id: number) => Api.get<GraphData>(`/visualization/${id}`)

export const GraphVisualizationService = {
    getVisualization
}