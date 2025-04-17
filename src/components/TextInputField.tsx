import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

type TextInputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  onCustomChange?: (value: any) => any;
} & Omit<TextFieldProps, "name" | "label" | "type">;

const TextInputField = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  onCustomChange,
  ...textFieldProps
}: TextInputFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          error={!!error}
          helperText={error?.message}
          fullWidth
          variant="outlined"
          onChange={(e) => {
            const value = e.target.value;
            const transformedValue = onCustomChange ? onCustomChange(value) : value;
            field.onChange(transformedValue);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
            },
          }}
          {...textFieldProps}
        />
      )}
    />
  );
};

export default TextInputField;