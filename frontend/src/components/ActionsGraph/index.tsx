import { Box, Grid, Slider, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { GraphData } from "../../schemas";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { GraphDataService } from "../../services/GraphDataService";
import FeedBackAlert from "../FeedBackAlert";

type IActionsGraphProps = {
    setData(state: GraphData): void
}

export default function ActionsGraph({ setData }: IActionsGraphProps) {

    const [labelLenght, setLabelLenght] = useState<number>()
    const [searchGraphDataLoading, setSearchGraphDataLoading] = useState<boolean>()
    const [loadingActions, setLoadingActions] = useState<boolean>(false)
    const [loadingError, setLoadingError] = useState<boolean>(false)
    const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [successMsg, setSuccessMsg] = useState<string>('')

    const searchGraphData = () => {

        setSearchGraphDataLoading(true)
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

        await GraphDataService.getGenerateAllData().then(async res => {
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

            <Typography variant="h4" >Ações:</Typography>
            <Box sx={{ marginTop: 1 }}>
                <Typography variant="h6">Número Máximo de Retornos de Nós/Arestas</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Slider defaultValue={5000} aria-label="Default" valueLabelDisplay="auto" max={10000} />

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
                <Grid container spacing={2} >
                    <Grid item xs={6}>
                        <Box>
                            <Typography component="p">Limpar Banco</Typography>
                            <LoadingButton
                                color="error"
                                size="small"
                                onClick={deleteGraphData}
                                loading={loadingActions}
                                endIcon={<DeleteIcon />}
                                loadingPosition="end"
                                variant="contained"
                            >
                                <span>Limpar</span>
                            </LoadingButton>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography component="p">Povoar Banco</Typography>

                        <LoadingButton
                            color="success"
                            size="small"
                            onClick={generateGraphData}
                            loading={loadingActions}
                            endIcon={<InsertChartIcon />}
                            loadingPosition="end"
                            variant="contained"
                        >
                            <span>Povoar</span>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}