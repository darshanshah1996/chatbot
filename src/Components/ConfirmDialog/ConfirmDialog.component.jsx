import { useContext } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SettingsContext } from '../../Context/SettingsContext';

export default function ConfirmDialog({ callBackFunction }) {
  const { dialogMessage, setDialogMessage } = useContext(SettingsContext);

  return (
    <>
      <Dialog
        open={dialogMessage}
        onClose={(event, reason) => {
          if (
            reason &&
            (reason == 'backdropClick' || reason == 'escapeKeyDown')
          ) {
            return;
          }
          setDialogMessage('');
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgb(53, 50, 50)',
            color: 'rgb(197, 191, 191)',
          },
          '& .MuiTypography-root': {
            color: 'rgb(197, 191, 191)',
          },
        }}
      >
        <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              callBackFunction(true);
              setDialogMessage('');
            }}
            autoFocus
          >
            Agree
          </Button>
          <Button
            onClick={() => {
              callBackFunction(false);
              setDialogMessage('');
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
