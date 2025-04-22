import { UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import { ReaderFormData } from "../types/formTypes";
import TextInputField from "./TextInputField";

interface ReaderFormProps {
  onSubmit: (data: ReaderFormData) => void;
  formMethods: UseFormReturn<ReaderFormData>;
}

const ReaderForm: React.FC<ReaderFormProps> = ({ onSubmit, formMethods }) => {
  const { handleSubmit } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInputField<ReaderFormData>
        name="name"
        label="Name"
        formMethods={formMethods}
        placeholder="Enter reader name"
        required
        variant="filled"
      />
      <TextInputField<ReaderFormData>
        name="email"
        label="Email"
        formMethods={formMethods}
        placeholder="Enter reader email"
        required
        variant="filled"
      />
      <TextInputField<ReaderFormData>
        name="phone"
        label="Phone"
        formMethods={formMethods}
        placeholder="Enter reader phone"
        required
        variant="filled"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  );
};

export default ReaderForm;