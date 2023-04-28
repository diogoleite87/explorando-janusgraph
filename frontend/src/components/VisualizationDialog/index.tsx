import { Close } from '@material-ui/icons'
import {
    Button,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    Stack,
    useTheme,
    Box,
    Typography,
    Dialog,
    DialogTitle,
} from '@mui/material'
import { useEffect, useState } from 'react'

import TextField from '@mui/material/TextField';
import { GraphData, GraphLink, GraphNode, People } from '../../schemas';
import { GraphPeopleService } from '../../services/GraphPeopleService';
import FeedBackAlert from '../FeedBackAlert';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import { GraphVisualizationService } from '../../services/GraphVisualizationService';

export interface IPeopleDialogProps {
    state: boolean
    setLoadingSuccess(state: boolean): void
    setLoadingError(state: boolean): void
    setLoadingErrorMsg(state: string): void
    setLoadingSuccessMsg(state: string): void
    setState(state: boolean): void
    node?: GraphNode
    link?: GraphLink
}

export default function VisualizationDialog({
    state,
    setState,
    setLoadingErrorMsg,
    setLoadingError,
    setLoadingSuccess,
    setLoadingSuccessMsg,
    node,
    link
}: IPeopleDialogProps) {

    const theme = useTheme()
    const [people, setPeople] = useState<People>({} as People)
    const [data, setData] = useState<GraphData>()
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<number>(0)
    const [gender, setGender] = useState<string>('')

    useEffect(() => {

        if (node?.label == 'People') {
            GraphPeopleService.getPeopleByID(Number(node.id)).then(res => {
                setLoadingError(false)
                setPeople(res.data)
                setName(res.data.name)
                setAge(res.data.age)
                setGender(res.data.gender)
                setLoadingSuccessMsg(`${node.label} recuperado com sucesso!`)
                setLoadingSuccess(true)
            }).catch(err => {
                setLoadingSuccess(false)
                setLoadingErrorMsg(err.message)
                setLoadingError(true)
            })
        }

        GraphVisualizationService.getVisualization(Number(node?.id)).then(res => {
            setData(res.data)
        })

    }, [])

    const updatePeople = async () => {
        await GraphPeopleService.updatePeople(people.id, { name, age, gender }).then(res => {
            setLoadingError(false)
            setLoadingSuccessMsg(`${node?.id} atualizado com sucesso!`)
            setLoadingSuccess(true)
        }).catch(err => {
            setLoadingSuccess(false)
            setLoadingErrorMsg(err.message)
            setLoadingError(true)
        })
    }
    return (

        <Dialog
            TransitionProps={{ unmountOnExit: true }}
            open={state}
            fullWidth
        >
            <DialogTitle color={theme.palette.grey[400]}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>Visualização {node ? node.label : link ? link.label : ''}</Grid>
                    <Grid item>
                        <IconButton sx={{ size: 'small' }} onClick={() => setState(false)}>
                            <Close />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box sx={{ width: '100%', height: '100%' }}>

                    {node != undefined && node.label == 'People' ?
                        <Box>
                            <Stack spacing={2} direction="row" sx={{ marginBottom: '3vh' }}>
                                <Box sx={{ width: '50%' }}>
                                    <TextField
                                        helperText="ID do Label"
                                        id="id"
                                        label="ID"
                                        fullWidth
                                        disabled
                                        value={people?.id}
                                    />
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <TextField
                                        helperText="Nome da Pessoa"
                                        id="name"
                                        label="Nome"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Box>
                            </Stack>
                            <Stack spacing={2} direction="row" sx={{ marginBottom: '3vh' }}>
                                <Box sx={{ width: '50%' }}>
                                    <TextField
                                        helperText="Idade da Pessoa"
                                        id="age"
                                        label="Idade"
                                        type='number'
                                        fullWidth
                                        value={age}
                                        onChange={(e) => setAge(Number(e.target.value))}
                                    />
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <TextField
                                        helperText="Genero da Pessoa"
                                        id="gender"
                                        label="Genero"
                                        fullWidth
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                </Box>
                            </Stack>


                        </Box>
                        : <></>
                    }
                </Box>

                <ForceGraph3D graphData={data} width={550} height={400} nodeAutoColorBy="label" />
            </DialogContent>
            <Divider />
            <Box sx={{ width: "100%" }}>
                <Stack spacing={2} sx={{ alignItems: "center", justifyContent: 'space-between', margin: '2vh' }} direction="row">
                    <Button variant="contained" component="label" color="error" onClick={() => setState(false)} >fechar</Button>
                    <Button variant="contained" component="label" color="primary" onClick={updatePeople}>Atualizar</Button>
                </Stack>
            </Box>
        </Dialog >
    )
}