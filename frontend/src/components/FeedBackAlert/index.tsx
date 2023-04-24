import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { forwardRef } from 'react';

type IFeedBackAlertProps = {
  type: "error" | "warning" | "info" | "success"
  handleClose(state: boolean): void
  message?: string
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ({ type, message, handleClose }: IFeedBackAlertProps) {

  return (
    <Snackbar open autoHideDuration={6000} onClose={() => handleClose(false)}>
      <Alert onClose={() => handleClose(false)} severity={type} sx={{ width: '100%' }}>
        {message ? message : 'Aviso'}
      </Alert>
    </Snackbar>

  );
}