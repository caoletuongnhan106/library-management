import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

const BookManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const { data: books = [] } = useQuery<Book[]>({
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
    defaultValues: editingBook
      ? { title: editingBook.title, author: editingBook.author, year: editingBook.year, genre: editingBook.genre }
      : { title: "", author: "", year: 0, genre: "" },
    resolver: yupResolver(bookSchema),
  });

  const handleAddOrUpdate = async (data: BookFormData) => {
    if (editingBook) {
      await updateMutation.mutateAsync({ id: editingBook.id, book: data });
      setEditingBook(null);
    } else {
      const newBook: Book = { ...data, id: Date.now() };
      await addMutation.mutateAsync(newBook);
    }
    formMethods.reset();
    setOpenDialog(false);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    formMethods.reset({
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
    });
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOpenDialog = () => {
    setEditingBook(null);
    formMethods.reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingBook(null);
    formMethods.reset();
    setOpenDialog(false);
  };

  const columns = [
    { label: "Title", key: "title" },
    { label: "Author", key: "author" },
    { label: "Year", key: "year" },
    {
      label: "Genre",
      key: "genre",
      render: (row: Book) => <Chip label={row.genre} color="primary" size="small" />,
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "Actions",
            key: "actions",
            render: (row: Book) => (
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
          onClick={handleOpenDialog}
          sx={{ mb: 3, py: 1.2, px: 3 }}
        >
          Add Book
        </Button>
      )}
      <CustomDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingBook ? "Edit Book" : "Add Book"}
      >
        <BookForm
          onSubmit={handleAddOrUpdate}
          formMethods={formMethods}
          editingBook={editingBook}
        />
      </CustomDialog>
      <CustomTable columns={columns} data={books} />
    </Paper>
  );
};

export default BookManagement;