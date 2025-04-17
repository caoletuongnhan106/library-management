import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { TextField, Box, Button } from "@mui/material";
import { Book } from "../api/mockApi";

type BookFormProps = {
  onSubmit: SubmitHandler<Book>;
  formMethods: UseFormReturn<Book, any, Book>; 
  editingBook: Book | null;
};

const BookForm: React.FC<BookFormProps> = ({ onSubmit, formMethods, editingBook }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  return (
    <Box display="flex" gap="10px" style={{ marginBottom: "20px" }}>
      <TextField
        label="Title"
        {...register("title", { required: true })}
        fullWidth
        error={!!errors.title}
        helperText={errors.title ? "Title is required" : ""}
      />
      <TextField
        label="Author"
        {...register("author", { required: true })}
        fullWidth
        error={!!errors.author}
        helperText={errors.author ? "Author is required" : ""}
      />
      <TextField
        label="Year"
        type="number"
        {...register("year", { required: true, valueAsNumber: true })}
        fullWidth
        error={!!errors.year}
        helperText={errors.year ? "Year is required" : ""}
      />
      <TextField
        label="Genre"
        {...register("genre", { required: true })}
        fullWidth
        error={!!errors.genre}
        helperText={errors.genre ? "Genre is required" : ""}
      />
      <Button
        type="submit"
        variant="contained"
        onClick={handleSubmit(onSubmit)}
      >
        {editingBook ? "Update Book" : "Add Book"}
      </Button>
    </Box>
  );
};

export default BookForm;