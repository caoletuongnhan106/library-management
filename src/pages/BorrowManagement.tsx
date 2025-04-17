import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { getBorrows, returnBook } from "../api/mockApi";
import { useAuth } from "../context/AuthContext";
import { Borrow, Book, Reader } from "../api/mockApi";
import { useQuery as useBooksQuery } from "@tanstack/react-query";
import { useQuery as useReadersQuery } from "@tanstack/react-query";
import { getBooks } from "../api/mockApi";
import { getReaders } from "../api/mockApi";

const BorrowManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: borrows = [] } = useQuery<Borrow[]>({
    queryKey: ["borrows"],
    queryFn: getBorrows,
  });

  const { data: books = [] } = useBooksQuery<Book[]>({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const { data: readers = [] } = useReadersQuery<Reader[]>({
    queryKey: ["readers"],
    queryFn: getReaders,
  });

  const returnMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
    },
  });

  const handleReturn = (id: number) => {
    returnMutation.mutate(id);
  };

  const getBookTitle = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : "Unknown";
  };

  const getReaderName = (readerId: number) => {
    const reader = readers.find((r) => r.id === readerId);
    return reader ? reader.name : "Unknown";
  };

  return (
    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Borrow Management
      </Typography>
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
              <TableCell>{getBookTitle(borrow.bookId)}</TableCell>
              <TableCell>{getReaderName(borrow.readerId)}</TableCell>
              <TableCell>{borrow.borrowDate}</TableCell>
              <TableCell>{borrow.returnDate || "Not Returned"}</TableCell>
              {user?.role === "admin" && !borrow.returnDate && (
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleReturn(borrow.id)}
                  >
                    Return
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

export default BorrowManagement;