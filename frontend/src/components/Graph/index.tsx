import { useEffect, useState } from 'react';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import { GraphDataService } from '../../services/GraphDataService';
import { GraphData } from '../../schemas';
import SelectGraph from '../SelectGraph';
import Box from '@mui/material/Box';
import LoadingBackDrop from '../LoadingBackDrop';
import FeedBackAlert from '../FeedBackAlert';
import { Grid } from '@mui/material';
import FilterGraphData from '../FilterGraphData';
import ActionsGraph from '../ActionsGraph';


export default function Graph() {

    const [data, setData] = useState<GraphData>()
    const [selectedGraph, setSelectedGraph] = useState<string>('Graph 2D');
    const [loadingAllGraphData, setLoadingAllGraphData] = useState<boolean>(false)
    const [loadingError, setLoadingError] = useState<boolean>(false)
    const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [successMsg, setSuccessMsg] = useState<string>('')
    const [widthGraph, setWidthGraph] = useState<number>(900);
    const [heightGraph, setHeightGraph] = useState<number>(700);


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

    return (
        <Box >
            {loadingAllGraphData ? <LoadingBackDrop /> : <></>}
            {loadingError ? <FeedBackAlert type={'error'} message={errorMsg} handleClose={setLoadingError} /> : <></>}
            {loadingSuccess ? <FeedBackAlert type={'success'} message={successMsg} handleClose={setLoadingSuccess} /> : <></>}

            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <Box >
                        <Box>
                            <SelectGraph names={["Graph 2D", "Graph 3D"]} selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
                        </Box>
                        <Box>
                            {
                                selectedGraph == 'Graph 3D' ? <ForceGraph3D graphData={data} nodeAutoColorBy="label" width={widthGraph} height={heightGraph - 80} /> :
                                    selectedGraph == 'Graph 2D' ? <ForceGraph2D graphData={data} nodeAutoColorBy="label" width={widthGraph} height={heightGraph - 80} /> :
                                        <></>
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