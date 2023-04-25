import Container from '@mui/material/Container';
import Graph from "../../components/Graph";
import { Box } from '@mui/material';

export default function Home() {
    return (
        <Container maxWidth="xl" sx={{ margin: 0, padding: 0 }} >
            <Box>
                <Graph />
            </Box>
        </Container>
    )
}