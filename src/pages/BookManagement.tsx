import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getBooks, addBook, updateBook, deleteBook, getStatistics } from "../api/mockApi";
import BookForm from "../components/BookForm";
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
import { Book } from "../api/mockApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BookManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const { data: books = [], refetch } = useQuery<Book[]>({
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
    mutationFn: ({ id, book }: { id: number; book: Omit<Book, "id"> }) =>
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

  const formMethods = useForm<Book>({
    defaultValues: editingBook || {
      id: 0,
      title: "",
      author: "",
      year: 0,
      genre: "",
    },
  });

  const handleAddOrUpdate = async (data: Book) => {
    if (editingBook) {
      await updateMutation.mutateAsync({ id: editingBook.id, book: data });
      setEditingBook(null);
    } else {
      await addMutation.mutateAsync(data);
    }
    formMethods.reset();
    setOpenDialog(false);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    formMethods.reset(book);
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

  return (
    <Paper sx={{ padding: "20px", margin: "20px auto", maxWidth: "1200px" }}>
      <Typography variant="h5" gutterBottom>
        Book Management
      </Typography>
      {stats && (
        <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
          Statistics: {stats.totalBooks} books, Top Author: {stats.topAuthor}, Top Year: {stats.topYear}
        </Typography>
      )}
      {user?.role === "admin" && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ marginBottom: "20px", bgcolor: "primary.main" }}
        >
          Add Book
        </Button>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editingBook ? "Edit Book" : "Add Book"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <BookForm
            onSubmit={handleAddOrUpdate}
            formMethods={formMethods}
            editingBook={editingBook}
          />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Genre</TableCell>
            {user?.role === "admin" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.year}</TableCell>
              <TableCell>{book.genre}</TableCell>
              {user?.role === "admin" && (
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(book)}
                    sx={{ mr: 1, color: "primary.main", borderColor: "primary.main" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(book.id)}
                  >
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

export default BookManagement;