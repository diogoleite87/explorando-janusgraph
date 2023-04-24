import { Api } from "../providers";
import { GraphData } from "../schemas";

const getGraphData = () => Api.get<GraphData>('/graph/all')

export const GraphDataService = {
    getGraphData
}