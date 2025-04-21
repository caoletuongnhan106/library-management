import { useState, useCallback } from "react";

interface UseDialogProps {
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDialogReturn {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useDialog = ({ onOpen, onClose }: UseDialogProps = {}): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  return { isOpen, openDialog, closeDialog };
};