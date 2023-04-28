import { useEffect, useState } from 'react';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import { GraphDataService } from '../../services/GraphDataService';
import { GraphData, GraphNode } from '../../schemas';
import SelectGraph from '../SelectGraph';
import Box from '@mui/material/Box';
import LoadingBackDrop from '../LoadingBackDrop';
import FeedBackAlert from '../FeedBackAlert';
import { Grid } from '@mui/material';
import FilterGraphData from '../FilterGraphData';
import ActionsGraph from '../ActionsGraph';
import VisualizationDialog from '../VisualizationDialog';
import { GraphInteractive } from '../GraphInteractive';


export default function Graph() {

    const [data, setData] = useState<GraphData>()
    const [selectedGraph, setSelectedGraph] = useState<string>('Graph 3D');
    const [loadingAllGraphData, setLoadingAllGraphData] = useState<boolean>(false)
    const [loadingError, setLoadingError] = useState<boolean>(false)
    const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [successMsg, setSuccessMsg] = useState<string>('')
    const [widthGraph, setWidthGraph] = useState<number>(900);
    const [heightGraph, setHeightGraph] = useState<number>(700);
    const [nodeClick, setNodeClick] = useState<boolean>(false)
    const [node, setNode] = useState<GraphNode>()

    useEffect(() => {
        setLoadingAllGraphData(true)

        GraphDataService.getGraphData().then(res => {
            setLoadingError(false)
            setLoadingSuccess(true)
            setSuccessMsg('Dados carregados com sucesso!')
            setData(res.data)
        }).catch(err => {
            setLoadingSuccess(false)
            setLoadingError(true)
            setErrorMsg(err.message)
        })

        setLoadingAllGraphData(false)
    }, [])

    const nodeClickPeople = (node: any) => {
        setNode(node)
        setNodeClick(true)
    }

    return (
        <Box >
            {loadingAllGraphData ? <LoadingBackDrop /> : <></>}
            {loadingError ? <FeedBackAlert type={'error'} message={errorMsg} handleClose={setLoadingError} /> : <></>}
            {loadingSuccess ? <FeedBackAlert type={'success'} message={successMsg} handleClose={setLoadingSuccess} /> : <></>}
            {nodeClick ? <VisualizationDialog state={nodeClick} setState={setNodeClick} node={node} setLoadingErrorMsg={setErrorMsg} setLoadingSuccessMsg={setSuccessMsg} setLoadingError={setLoadingError} setLoadingSuccess={setLoadingSuccess} /> : <></>}
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <Box >
                        <Box>
                            <SelectGraph names={["Graph 2D", "Graph 3D", "Graph Interactive 2D", "Graph Interactive 3D"]} selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
                        </Box>
                        <Box>
                            {
                                selectedGraph == 'Graph 3D' ? <ForceGraph3D graphData={data} nodeAutoColorBy="label" width={widthGraph} height={heightGraph - 80}
                                    onNodeClick={(node) => nodeClickPeople(node)}
                                /> :
                                    selectedGraph == 'Graph 2D' ? <ForceGraph2D graphData={data} nodeAutoColorBy="label" width={widthGraph} height={heightGraph - 80} /> :
                                        <GraphInteractive width={widthGraph} height={heightGraph - 80} type={selectedGraph == 'Graph Interactive 2D' ? 'Graph 2D' : 'Graph 3D'} />
                            }
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <ActionsGraph setData={setData} />
                    <FilterGraphData />
                </Grid>
            </Grid>

        </Box>
    )
}