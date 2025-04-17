import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getReaders, addReader, updateReader, deleteReader } from "../api/mockApi";
import ReaderForm from "../components/ReaderForm";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Reader } from "../api/mockApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ReaderManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingReader, setEditingReader] = useState<Reader | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const { data: readers = [] } = useQuery<Reader[]>({
    queryKey: ["readers"],
    queryFn: getReaders,
  });

  const addMutation = useMutation({
    mutationFn: addReader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, reader }: { id: number; reader: Omit<Reader, "id"> }) =>
      updateReader(id, reader),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });

  const formMethods = useForm<Reader>({
    defaultValues: editingReader || {
      id: 0,
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleAddOrUpdate = async (data: Reader) => {
    if (editingReader) {
      await updateMutation.mutateAsync({ id: editingReader.id, reader: data });
      setEditingReader(null);
    } else {
      await addMutation.mutateAsync(data);
    }
    formMethods.reset();
    setOpenDialog(false);
  };

  const handleEdit = (reader: Reader) => {
    setEditingReader(reader);
    formMethods.reset(reader);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOpenDialog = () => {
    setEditingReader(null);
    formMethods.reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingReader(null);
    formMethods.reset();
    setOpenDialog(false);
  };

  return (
    <Paper sx={{ padding: "20px", margin: "20px auto", maxWidth: "1200px" }}>
      <Typography variant="h5" gutterBottom>
        Reader Management
      </Typography>
      {user?.role === "admin" && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ marginBottom: "20px", bgcolor: "primary.main" }}
        >
          Add Reader
        </Button>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editingReader ? "Edit Reader" : "Add Reader"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <ReaderForm
            onSubmit={handleAddOrUpdate}
            formMethods={formMethods}
            editingReader={editingReader}
          />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            {user?.role === "admin" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {readers.map((reader) => (
            <TableRow key={reader.id}>
              <TableCell>{reader.name}</TableCell>
              <TableCell>{reader.email}</TableCell>
              <TableCell>{reader.phone}</TableCell>
              {user?.role === "admin" && (
                <TableBody>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(reader)}
                    sx={{ mr: 1, color: "primary.main", borderColor: "primary.main" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(reader.id)}
                  >
                    Delete
                  </Button>
                </TableBody>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ReaderManagement;