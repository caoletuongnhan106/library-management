import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getBooks, addBook, updateBook, deleteBook, getStatistics } from "../api/mockApi";
import BookForm from "../components/BookForm";
import { Button, Typography, Paper, Chip } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Book } from "../api/mockApi";
import { bookSchema } from "../validation/bookSchema";
import { BookFormData } from "../types/formTypes";
import CustomDialog from "../components/CustomDialog";
import CustomTable from "../components/CustomTable";
import { useDialog } from "../hooks/useDialog";

const BookManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { user } = useAuth();

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const { data: stats } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, book }: { id: number; book: BookFormData }) =>
      updateBook(id, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });

  const formMethods = useForm<BookFormData>({
    defaultValues: { title: "", author: "", year: 0, genre: "" },
    resolver: yupResolver(bookSchema),
  });

  const { isOpen, openDialog, closeDialog } = useDialog({
    onOpen: () => {
      setEditingBook(null);
      formMethods.reset({ title: "", author: "", year: 0, genre: "" });
    },
    onClose: () => {
      setEditingBook(null);
      formMethods.reset({ title: "", author: "", year: 0, genre: "" });
    },
  });

  const handleAddOrUpdate = useCallback(
    async (data: BookFormData) => {
      if (editingBook) {
        await updateMutation.mutateAsync({ id: editingBook.id, book: data });
        setEditingBook(null);
      } else {
        const newBook: Book = { ...data, id: Date.now() };
        await addMutation.mutateAsync(newBook);
      }
      closeDialog();
    },
    [editingBook, updateMutation, addMutation, closeDialog]
  );

  const handleEdit = useCallback(
    (book: Book) => {
      setEditingBook(book);
      formMethods.reset({
        title: book.title,
        author: book.author,
        year: book.year,
        genre: book.genre,
      });
      openDialog();
    },
    [formMethods, setEditingBook, openDialog]
  );

  const handleDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const renderGenre = useCallback((row: Book) => {
    return <Chip label={row.genre} color="primary" size="small" />;
  }, []);

  const renderActions = useCallback(
    (row: Book) => {
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
      { label: "Title", key: "title" },
      { label: "Author", key: "author" },
      { label: "Year", key: "year" },
      { label: "Genre", key: "genre", render: renderGenre },
      ...(user?.role === "admin"
        ? [{ label: "Actions", key: "actions", render: renderActions }]
        : []),
    ],
    [user?.role, renderGenre, renderActions]
  );

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Book Management
      </Typography>
      {stats && (
        <Typography variant="h6" gutterBottom sx={{ color: "#666666" }}>
          Statistics: {stats.totalBooks} books | Top Author: {stats.topAuthor} | Top Year: {stats.topYear}
        </Typography>
      )}
      {user?.role === "admin" && (
        <Button
          variant="contained"
          onClick={openDialog}
          sx={{ mb: 3, py: 1.2, px: 3 }}
        >
          Add Book
        </Button>
      )}
      <CustomDialog
        open={isOpen}
        onClose={closeDialog}
        title={editingBook ? "Edit Book" : "Add Book"}
      >
        <BookForm
          onSubmit={handleAddOrUpdate}
          formMethods={formMethods}
          editingBook={editingBook}
        />
      </CustomDialog>
      <CustomTable columns={columns} data={books} isLoading={isLoading} />
    </Paper>
  );
};

export default BookManagement;