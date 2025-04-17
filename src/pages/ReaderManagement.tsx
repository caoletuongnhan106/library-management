import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getReaders, addReader, updateReader, deleteReader } from "../api/mockApi";
import ReaderForm from "../components/ReaderForm";
import { Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Reader } from "../api/mockApi";
import { readerSchema } from "../validation/readerSchema";
import { ReaderFormData } from "../types/formTypes";
import CustomDialog from "../components/CustomDialog";
import CustomTable from "../components/CustomTable";

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
    mutationFn: ({ id, reader }: { id: number; reader: ReaderFormData }) =>
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

  const formMethods = useForm<ReaderFormData>({
    defaultValues: editingReader
      ? { name: editingReader.name, email: editingReader.email, phone: editingReader.phone }
      : { name: "", email: "", phone: "" },
    resolver: yupResolver(readerSchema),
  });

  const handleAddOrUpdate = async (data: ReaderFormData) => {
    if (editingReader) {
      await updateMutation.mutateAsync({ id: editingReader.id, reader: data });
      setEditingReader(null);
    } else {
      const newReader: Reader = { ...data, id: Date.now() };
      await addMutation.mutateAsync(newReader);
    }
    formMethods.reset();
    setOpenDialog(false);
  };

  const handleEdit = (reader: Reader) => {
    setEditingReader(reader);
    formMethods.reset({
      name: reader.name,
      email: reader.email,
      phone: reader.phone,
    });
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

  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    ...(user?.role === "admin"
      ? [
          {
            label: "Actions",
            key: "actions",
            render: (row: Reader) => (
              <>
                <Button
                  variant="outlined"
                  onClick={() => handleEdit(row)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reader Management
      </Typography>
      {user?.role === "admin" && (
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{ mb: 3, py: 1.2, px: 3 }}
        >
          Add Reader
        </Button>
      )}
      <CustomDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingReader ? "Edit Reader" : "Add Reader"}
      >
        <ReaderForm
          onSubmit={handleAddOrUpdate}
          formMethods={formMethods}
          editingReader={editingReader}
        />
      </CustomDialog>
      <CustomTable columns={columns} data={readers} />
    </Paper>
  );
};

export default ReaderManagement;