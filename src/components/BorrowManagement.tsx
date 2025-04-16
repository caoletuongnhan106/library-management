import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBorrows, borrowBook, returnBook, getBooks, getReaders } from "../api/mockApi";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

type Borrow = {
  id: number;
  bookId: number;
  readerId: number;
  borrowDate: string;
  returnDate?: string;
};

type BorrowForm = {
  bookId: number;
  readerId: number;
};

const BorrowManagement: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<BorrowForm>();

  const { data: borrows = [] } = useQuery<Borrow[]>({
    queryKey: ["borrows"],
    queryFn: getBorrows,
  });

  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const { data: readers = [] } = useQuery({
    queryKey: ["readers"],
    queryFn: getReaders,
  });

  const borrowMutation = useMutation({
    mutationFn: borrowBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["borrows"] }),
  });

  const returnMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["borrows"] }),
  });

  const onSubmit: SubmitHandler<BorrowForm> = (data) => {
    borrowMutation.mutate({ ...data, borrowDate: new Date().toISOString().split("T")[0] });
  };

  const handleReturn = (id: number) => {
    returnMutation.mutate(id);
  };

  return (
    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Borrow Management
      </Typography>
      {user?.role === "admin" && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px" }}>
          <Box display="flex" gap="10px">
            <FormControl fullWidth>
              <InputLabel>Book</InputLabel>
              <Select {...register("bookId", { required: true, valueAsNumber: true })}>
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Reader</InputLabel>
              <Select {...register("readerId", { required: true, valueAsNumber: true })}>
                {readers.map((reader) => (
                  <MenuItem key={reader.id} value={reader.id}>
                    {reader.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">
              Borrow Book
            </Button>
          </Box>
        </form>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book</TableCell>
            <TableCell>Reader</TableCell>
            <TableCell>Borrow Date</TableCell>
            <TableCell>Return Date</TableCell>
            {user?.role === "admin" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {borrows.map((borrow) => (
            <TableRow key={borrow.id}>
              <TableCell>{books.find((book) => book.id === borrow.bookId)?.title}</TableCell>
              <TableCell>{readers.find((reader) => reader.id === borrow.readerId)?.name}</TableCell>
              <TableCell>{borrow.borrowDate}</TableCell>
              <TableCell>{borrow.returnDate || "Not Returned"}</TableCell>
              {user?.role === "admin" && (
                <TableCell>
                  {!borrow.returnDate && (
                    <Button onClick={() => handleReturn(borrow.id)} variant="outlined">
                      Return
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default BorrowManagement;