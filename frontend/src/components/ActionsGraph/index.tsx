import { Box, Grid, Slider, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { GraphData } from "../../schemas";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { GraphDataService } from "../../services/GraphDataService";
import FeedBackAlert from "../FeedBackAlert";
import LoadingBackDrop from "../LoadingBackDrop";

type IActionsGraphProps = {
    setData(state: GraphData): void
}

export default function ActionsGraph({ setData }: IActionsGraphProps) {

    const [labelLenght, setLabelLenght] = useState<number>(5000)
    const [searchGraphDataLoading, setSearchGraphDataLoading] = useState<boolean>()
    const [loadingActions, setLoadingActions] = useState<boolean>(false)
    const [loadingError, setLoadingError] = useState<boolean>(false)
    const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [successMsg, setSuccessMsg] = useState<string>('')
    const [lenghtGenerate, setLenghtGenerate] = useState<number>(1000)

    const searchGraphData = async () => {

        setSearchGraphDataLoading(true)

        await GraphDataService.getGraphDataLimit(labelLenght).then(res => {
            setSuccessMsg('Limite aplicado com sucesso!')
            setData(res.data)
            setLoadingSuccess(true)
        }).catch(err => {
            setErrorMsg(err.message)
            setLoadingError(true)
        })

        setSearchGraphDataLoading(false)

    }

    const deleteGraphData = async () => {
        setLoadingActions(true)

        await GraphDataService.getDeleteAllData().then(res => {
            setLoadingError(false)
            setLoadingSuccess(true)
            setSuccessMsg('Banco foi limpo com sucesso!')
            setData({ nodes: [], links: [] })
        }).catch(err => {
            setLoadingSuccess(false)
            setLoadingError(true)
            setErrorMsg(err.message)
        })

        setLoadingActions(false)
    }

    const generateGraphData = async () => {
        setLoadingActions(true)

        await GraphDataService.getGenerateAllData(lenghtGenerate).then(async res => {
            setLoadingError(false)
            setLoadingSuccess(true)
            setSuccessMsg('Banco foi povoado com sucesso!')

            await GraphDataService.getGraphData().then(res => {
                setData(res.data)
            })
        }).catch(err => {
            setLoadingSuccess(false)
            setLoadingError(true)
            setErrorMsg(err.message)
        })

        setLoadingActions(false)
    }

    return (
        <Box>

            {loadingError ? <FeedBackAlert type={'error'} message={errorMsg} handleClose={setLoadingError} /> : <></>}
            {loadingSuccess ? <FeedBackAlert type={'success'} message={successMsg} handleClose={setLoadingSuccess} /> : <></>}
            {loadingActions ? <LoadingBackDrop /> : <></>}


            <Typography variant="h4" >Ações:</Typography>
            <Box sx={{ marginTop: 1 }}>
                <Typography variant="h6">Número Máximo de Retornos de Nós/Arestas</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Slider defaultValue={labelLenght} aria-label="Default" valueLabelDisplay="auto" max={10000} />

                    </Grid>
                    <Grid item xs={4}>
                        <LoadingButton
                            size="small"
                            onClick={searchGraphData}
                            loading={searchGraphDataLoading}
                            endIcon={<SendIcon />}
                            loadingPosition="end"
                            variant="contained"
                        >
                            <span>Buscar</span>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <Typography variant="h6">Banco de Dados</Typography>
                <Grid container spacing={2}>
                    <Grid item >
                        <Box sx={{ flexDirection: 'column' }}>
                            <Box sx={{ padding: 1 }}>
                                <LoadingButton
                                    color="error"
                                    size="small"
                                    onClick={deleteGraphData}
                                    loading={loadingActions}
                                    endIcon={<DeleteIcon />}
                                    loadingPosition="end"
                                    variant="contained"
                                    fullWidth
                                >
                                    <span>Limpar</span>
                                </LoadingButton>
                            </Box>
                            <Box sx={{ padding: 1 }}>
                                <LoadingButton
                                    color="success"
                                    size="small"
                                    onClick={generateGraphData}
                                    loading={loadingActions}
                                    endIcon={<InsertChartIcon />}
                                    loadingPosition="end"
                                    variant="contained"
                                    fullWidth
                                >
                                    <span>Povoar</span>
                                </LoadingButton>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item >
                        <Box sx={{ display: 'flex', padding: 2 }}>
                            <TextField label="Número de Pessoas" variant="outlined" defaultValue={lenghtGenerate} onChange={(e) => setLenghtGenerate(Number(e.target.value))}
                                sx={{ alignItems: 'center', justifyContent: 'center' }}
                            />
                        </Box>
                    </Grid>
                </Grid>

            </Box>
        </Box>
    )
}