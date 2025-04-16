import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReaders, addReader, updateReader, deleteReader } from "../api/mockApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

type Reader = {
  id?: number;
  name: string;
  email: string;
  phone: string;
};

const ReaderManagement: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<Reader>();
  const [editingReader, setEditingReader] = useState<Reader | null>(null);
  const [search, setSearch] = useState("");

  const { data: readers = [] } = useQuery<Reader[]>({
    queryKey: ["readers"],
    queryFn: getReaders,
  });

  const addMutation = useMutation({
    mutationFn: addReader,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readers"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedReader }: { id: number; updatedReader: Omit<Reader, "id"> }) =>
      updateReader(id, updatedReader),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReader,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readers"] }),
  });

  const onSubmit: SubmitHandler<Reader> = (data) => {
    if (editingReader) {
      updateMutation.mutate({ id: editingReader.id!, updatedReader: data });
      setEditingReader(null);
    } else {
      addMutation.mutate(data);
    }
    reset();
  };

  const handleEdit = (reader: Reader) => {
    setEditingReader(reader);
    reset(reader);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredReaders = readers.filter(
    (reader) =>
      reader.name.toLowerCase().includes(search.toLowerCase()) ||
      reader.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Reader Management
      </Typography>
      <TextField
        label="Search Readers"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ marginBottom: "20px" }}
      />
      {user?.role === "admin" && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px" }}>
          <Box display="flex" gap="10px">
            <TextField label="Name" {...register("name", { required: true })} fullWidth />
            <TextField label="Email" {...register("email", { required: true })} fullWidth />
            <TextField label="Phone" {...register("phone", { required: true })} fullWidth />
            <Button type="submit" variant="contained">
              {editingReader ? "Update Reader" : "Add Reader"}
            </Button>
          </Box>
        </form>
      )}
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
          {filteredReaders.map((reader) => (
            <TableRow key={reader.id}>
              <TableCell>{reader.name}</TableCell>
              <TableCell>{reader.email}</TableCell>
              <TableCell>{reader.phone}</TableCell>
              {user?.role === "admin" && (
                <TableCell>
                  <Button onClick={() => handleEdit(reader)} variant="outlined" sx={{ marginRight: "10px" }}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(reader.id!)} variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ReaderManagement;