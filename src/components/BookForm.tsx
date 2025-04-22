import { UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import { BookFormData } from "../types/formTypes";
import TextInputField from "./TextInputField";

interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  formMethods: UseFormReturn<BookFormData>;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, formMethods }) => {
  const { handleSubmit } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInputField<BookFormData>
        name="title"
        label="Title"
        formMethods={formMethods}
        placeholder="Enter book title"
        required
        variant="filled"
      />
      <TextInputField<BookFormData>
        name="author"
        label="Author"
        formMethods={formMethods}
        placeholder="Enter author name"
        required
        variant="filled"
      />
      <TextInputField<BookFormData>
        name="year"
        label="Year"
        type="number"
        formMethods={formMethods}
        placeholder="Enter publication year"
        required
        variant="filled"
      />
      <TextInputField<BookFormData>
        name="genre"
        label="Genre"
        formMethods={formMethods}
        placeholder="Enter book genre"
        required
        variant="filled"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  );
};

export default BookForm;