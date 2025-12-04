import { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = memo<ConfirmationDialogProps>(
  ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
  }) => {
    return (
      <Dialog open={open} onClose={onCancel}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onConfirm} variant="contained" autoFocus>
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

ConfirmationDialog.displayName = 'ConfirmationDialog';
