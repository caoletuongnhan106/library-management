import { UseFormReturn } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { BookFormData } from "../types/formTypes";

interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  formMethods: UseFormReturn<BookFormData>;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, formMethods }) => {
  const { register, handleSubmit, formState: { errors } } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Title"
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message || ""}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Author"
        {...register("author")}
        error={!!errors.author}
        helperText={errors.author?.message || ""}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Year"
        type="number"
        {...register("year", { valueAsNumber: true })}
        error={!!errors.year}
        helperText={errors.year?.message || ""}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Genre"
        {...register("genre")}
        error={!!errors.genre}
        helperText={errors.genre?.message || ""}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  );
};

export default BookForm;