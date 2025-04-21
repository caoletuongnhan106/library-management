import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getReaders, addReader, updateReader, deleteReader } from "../api/mockApi";
import ReaderForm from "../components/ReaderForm";
import { Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Reader } from "../api/mockApi";
import { readerSchema } from "../validation/readerSchema";
import { ReaderFormData } from "../types/formTypes";
import CustomTable from "../components/CustomTable";
import { useDialog } from "../hooks/useDialog";
import RoleBasedRender from "../components/RoleBasedRender";

const ReaderManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingReader, setEditingReader] = useState<Reader | null>(null);
  const { user } = useAuth();

  const { data: readers = [], isLoading: isReadersLoading } = useQuery<Reader[]>({
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
    mutationFn: (id: number) => deleteReader(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });

  const formMethods = useForm<ReaderFormData>({
    defaultValues: { name: "", email: "", phone: "" },
    resolver: yupResolver(readerSchema),
  });

  const handleAddOrUpdate = useCallback(
    async (data: ReaderFormData, closeDialog: () => void) => {
      if (editingReader) {
        await updateMutation.mutateAsync({ id: editingReader.id, reader: data });
        setEditingReader(null);
      } else {
        const newReader: Reader = { ...data, id: Date.now() };
        await addMutation.mutateAsync(newReader);
      }
      closeDialog();
    },
    [editingReader, updateMutation, addMutation]
  );

  const { openDialog, closeDialog, content } = useDialog({
    onOpen: () => {
      setEditingReader(null);
      formMethods.reset({ name: "", email: "", phone: "" });
    },
    onClose: () => {
      setEditingReader(null);
      formMethods.reset({ name: "", email: "", phone: "" });
    },
    title: editingReader ? "Edit Reader" : "Add Reader",
    children: (
      <ReaderForm
        onSubmit={(data) => handleAddOrUpdate(data, closeDialog)}
        formMethods={formMethods}
        editingReader={editingReader}
      />
    ),
  });

  const handleEdit = useCallback(
    (reader: Reader) => {
      setEditingReader(reader);
      formMethods.reset({
        name: reader.name,
        email: reader.email,
        phone: reader.phone,
      });
      openDialog();
    },
    [formMethods, setEditingReader, openDialog]
  );

  const handleDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const renderActions = useCallback(
    (row: Reader) => {
      return (
        <>
          <Button variant="outlined" onClick={() => handleEdit(row)} sx={{ mr: 1 }}>
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
      );
    },
    [handleEdit, handleDelete]
  );

  const columns = useMemo(
    () => [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
      ...(user?.role === "admin"
        ? [{ label: "Actions", key: "actions", render: renderActions }]
        : []),
    ],
    [user?.role, renderActions]
  );

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reader Management
      </Typography>
      <RoleBasedRender role={user?.role}>
        <Button
          variant="contained"
          onClick={openDialog}
          sx={{ mb: 3, py: 1.2, px: 3 }}
        >
          Add Reader
        </Button>
      </RoleBasedRender>
      {content}
      <CustomTable columns={columns} data={readers} isLoading={isReadersLoading} />
    </Paper>
  );
};

export default ReaderManagement;