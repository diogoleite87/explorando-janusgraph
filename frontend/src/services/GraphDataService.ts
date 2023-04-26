import { Api } from "../providers";
import { GraphData } from "../schemas";

const getGraphData = () => Api.get<GraphData>('/graph/all')
const getGenerateAllData = (lenght: number) => Api.get(`/generate/${lenght}`)
const getDeleteAllData = () => Api.get('/delete/all')
const getGraphDataLimit = (limit: number) => Api.get<GraphData>(`graph/${limit}`)

export const GraphDataService = {
    getGraphData,
    getDeleteAllData,
    getGenerateAllData,
    getGraphDataLimit
}