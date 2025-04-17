import { Dialog, DialogTitle, DialogContent, DialogProps } from "@mui/material";
import { ReactNode } from "react";

type CustomDialogProps = {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
} & Omit<DialogProps, "open" | "onClose" | "title" | "children">;

const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  children,
  open,
  onClose,
  ...dialogProps
}) => {
  return (
    <Dialog open={open} onClose={onClose} {...dialogProps}>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white", py: 2 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;