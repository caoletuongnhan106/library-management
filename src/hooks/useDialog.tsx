import { useState, useCallback, JSX } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { ReactNode } from "react";

interface UseDialogProps {
  onOpen?: () => void;
  onClose?: () => void;
  title: string;
  children: ReactNode;
}

interface UseDialogReturn {
  openDialog: () => void;
  closeDialog: () => void;
  content: JSX.Element;
}

export const useDialog = ({ onOpen, onClose, title, children }: UseDialogProps): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleDialogClose = useCallback((_event: object, reason: string) => {
    if (reason !== "backdropClick") {
      closeDialog();
    }
  }, [closeDialog]);

  const dialogContent = (
    <Dialog open={isOpen} onClose={handleDialogClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  return { openDialog, closeDialog, content: dialogContent };
};