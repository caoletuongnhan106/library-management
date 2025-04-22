import { useState, useCallback, ReactNode } from "react";

interface UseDialogProps {
  title: string;
  children: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDialogReturn {
  open: boolean;
  title: string;
  children: ReactNode;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useDialog = ({ title, children, onOpen, onClose }: UseDialogProps): UseDialogReturn => {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeDialog = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  return {
    open,
    title,
    children,
    openDialog,
    closeDialog,
  };
};