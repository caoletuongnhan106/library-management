import { UseFormReturn } from "react-hook-form";
import { Button, Box } from "@mui/material";
import { Book } from "../api/mockApi";
import { BookFormData } from "../types/formTypes";
import TextInputField from "./TextInputField";

type BookFormProps = {
  onSubmit: (data: BookFormData) => void;
  formMethods: UseFormReturn<BookFormData>;
  editingBook: Book | null;
};

const BookForm: React.FC<BookFormProps> = ({ onSubmit, formMethods, editingBook }) => {
  const { handleSubmit } = formMethods;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextInputField<BookFormData>
        name="title"
        control={formMethods.control}
        label="Title"
      />
      <TextInputField<BookFormData>
        name="author"
        control={formMethods.control}
        label="Author"
      />
      <TextInputField<BookFormData>
        name="year"
        control={formMethods.control}
        label="Year"
        type="number"
        onCustomChange={(value) => parseInt(value, 10)}
      />
      <TextInputField<BookFormData>
        name="genre"
        control={formMethods.control}
        label="Genre"
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ flex: 1, py: 1.2 }}
        >
          {editingBook ? "Update" : "Add"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => formMethods.reset()}
          sx={{ flex: 1, py: 1.2 }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default BookForm;