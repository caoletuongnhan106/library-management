import { UseFormReturn } from "react-hook-form";
import { Button, Box } from "@mui/material";
import { Reader } from "../api/mockApi";
import { ReaderFormData } from "../types/formTypes";
import TextInputField from "./TextInputField";

type ReaderFormProps = {
  onSubmit: (data: ReaderFormData) => void;
  formMethods: UseFormReturn<ReaderFormData>;
  editingReader: Reader | null;
};

const ReaderForm: React.FC<ReaderFormProps> = ({
  onSubmit,
  formMethods,
  editingReader,
}) => {
  const { handleSubmit } = formMethods;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextInputField<ReaderFormData>
        name="name"
        control={formMethods.control}
        label="Name"
      />
      <TextInputField<ReaderFormData>
        name="email"
        control={formMethods.control}
        label="Email"
      />
      <TextInputField<ReaderFormData>
        name="phone"
        control={formMethods.control}
        label="Phone"
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ flex: 1, py: 1.2 }}
        >
          {editingReader ? "Update" : "Add"}
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

export default ReaderForm;