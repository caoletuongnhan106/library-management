import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBooks, addBook, updateBook, deleteBook } from "../api/mockApi";
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

type Book = {
  id?: number;
  title: string;
  author: string;
  year: number;
  genre: string;
};

const BookManagement: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<Book>();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [search, setSearch] = useState("");

  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedBook }: { id: number; updatedBook: Omit<Book, "id"> }) =>
      updateBook(id, updatedBook),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });

  const onSubmit: SubmitHandler<Book> = (data) => {
    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id!, updatedBook: data });
      setEditingBook(null);
    } else {
      addMutation.mutate(data);
    }
    reset();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    reset(book);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Book Management
      </Typography>
      <TextField
        label="Search Books"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ marginBottom: "20px" }}
      />
      {user?.role === "admin" && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px" }}>
          <Box display="flex" gap="10px">
            <TextField label="Title" {...register("title", { required: true })} fullWidth />
            <TextField label="Author" {...register("author", { required: true })} fullWidth />
            <TextField
              label="Year"
              type="number"
              {...register("year", { required: true, valueAsNumber: true })}
              fullWidth
            />
            <TextField label="Genre" {...register("genre", { required: true })} fullWidth />
            <Button type="submit" variant="contained">
              {editingBook ? "Update Book" : "Add Book"}
            </Button>
          </Box>
        </form>
      )}
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
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.year}</TableCell>
              <TableCell>{book.genre}</TableCell>
              {user?.role === "admin" && (
                <TableCell>
                  <Button onClick={() => handleEdit(book)} variant="outlined" sx={{ marginRight: "10px" }}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(book.id!)} variant="outlined" color="error">
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