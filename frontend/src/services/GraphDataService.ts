import { Api } from "../providers";
import { GraphData } from "../schemas";

const getGraphData = () => Api.get<GraphData>('/graph/all')
const getGenerateAllData = () => Api.get('/generate')
const getDeleteAllData = () => Api.get('/delete/all')

export const GraphDataService = {
    getGraphData,
    getDeleteAllData,
    getGenerateAllData
}