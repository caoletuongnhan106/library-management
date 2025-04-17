import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { TextField, Box, Button } from "@mui/material";
import { Reader } from "../api/mockApi";

type ReaderFormProps = {
  onSubmit: SubmitHandler<Reader>;
  formMethods: UseFormReturn<Reader, any, Reader>;
  editingReader: Reader | null;
};

const ReaderForm: React.FC<ReaderFormProps> = ({ onSubmit, formMethods, editingReader }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  return (
    <Box display="flex" gap="10px" style={{ marginBottom: "20px" }}>
      <TextField
        label="Name"
        {...register("name", { required: true })}
        fullWidth
        error={!!errors.name}
        helperText={errors.name ? "Name is required" : ""}
      />
      <TextField
        label="Email"
        {...register("email", { required: true })}
        fullWidth
        error={!!errors.email}
        helperText={errors.email ? "Email is required" : ""}
      />
      <TextField
        label="Phone"
        {...register("phone", { required: true })}
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone ? "Phone is required" : ""}
      />
      <Button
        type="submit"
        variant="contained"
        onClick={handleSubmit(onSubmit)}
      >
        {editingReader ? "Update Reader" : "Add Reader"}
      </Button>
    </Box>
  );
};

export default ReaderForm;