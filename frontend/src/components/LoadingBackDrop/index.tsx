import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingBackDrop() {

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 1 }}
            open
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}