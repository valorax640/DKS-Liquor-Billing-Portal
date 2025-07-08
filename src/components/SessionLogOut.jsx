import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const SessionLoggedOutDialog = ({ open, onClose }) => {
  const handleLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="session-logout-title"
      aria-describedby="session-logout-description"
      maxWidth='xs'
    >
      <DialogTitle id="session-logout-title">Session Timed Out</DialogTitle>
      <DialogContent dividers>
        <Typography id="session-logout-description">
          Your session has expired due to inactivity. Please log in again to continue.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionLoggedOutDialog;
