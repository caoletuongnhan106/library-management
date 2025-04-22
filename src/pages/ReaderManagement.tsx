import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getReaders, addReader, updateReader, deleteReader } from "../api/mockApi";
import ReaderForm from "../components/ReaderForm";
import DialogCustom from "../components/DialogCustom";
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
    mutationFn: deleteReader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });

  const formMethods: UseFormReturn<ReaderFormData> = useForm<ReaderFormData>({
    defaultValues: { name: "", email: "", phone: "", id: undefined },
    resolver: yupResolver(readerSchema),
  });

  const handleAddOrUpdate = useCallback(
    async (data: ReaderFormData, closeDialog: () => void) => {
      const editingReaderId = formMethods.getValues("id");
      if (editingReaderId) {
        await updateMutation.mutateAsync({ id: editingReaderId, reader: data });
      } else {
        const newReader: Reader = { ...data, id: Date.now() };
        await addMutation.mutateAsync(newReader);
      }
      formMethods.reset({ name: "", email: "", phone: "", id: undefined });
      closeDialog();
    },
    [updateMutation, addMutation, formMethods]
  );

  const { open, title, children, openDialog, closeDialog } = useDialog({
    onOpen: () => {
      formMethods.reset({ name: "", email: "", phone: "", id: undefined });
    },
    onClose: () => {
      formMethods.reset({ name: "", email: "", phone: "", id: undefined });
    },
    title: formMethods.getValues("id") ? "Edit Reader" : "Add Reader",
    children: (
      <ReaderForm
        onSubmit={(data) => handleAddOrUpdate(data, closeDialog)}
        formMethods={formMethods}
      />
    ),
  });

  const handleEdit = useCallback(
    (reader: Reader) => {
      formMethods.reset({
        id: reader.id,
        name: reader.name,
        email: reader.email,
        phone: reader.phone,
      });
      openDialog();
    },
    [formMethods, openDialog]
  );

  const handleDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const renderActions = (row: Reader) => {
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
  };

  const columns = useMemo(
    () => [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
      ...(user?.role === "admin"
        ? [{ label: "Actions", key: "actions", render: renderActions }]
        : []),
    ],
    [user?.role, handleEdit, handleDelete] // Dependencies updated to include handleEdit and handleDelete
  );

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reader Management
      </Typography>
      <RoleBasedRender allowRole={["admin"]}>
        <Button
          variant="contained"
          onClick={openDialog}
          sx={{ mb: 3, py: 1.2, px: 3 }}
        >
          Add Reader
        </Button>
      </RoleBasedRender>
      <DialogCustom
        open={open}
        title={title}
        onClose={closeDialog}
      >
        {children}
      </DialogCustom>
      <CustomTable columns={columns} data={readers} isLoading={isReadersLoading} />
    </Paper>
  );
};

export default ReaderManagement;