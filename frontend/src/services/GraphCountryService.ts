import { Api } from "../providers";
import { GraphData } from "../schemas";

const getGraphData = () => Api.get<GraphData>('/country/all')

export const GraphCountryService = {
    getGraphData
}