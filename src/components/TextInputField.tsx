import { TextField, TextFieldProps } from "@mui/material";
import { UseFormReturn, Path } from "react-hook-form";
import { FieldValues } from "react-hook-form";

interface TextInputFieldProps<T extends FieldValues> extends Omit<TextFieldProps, "name" | "label"> {
  name: Path<T>;
  label: string;
  formMethods: UseFormReturn<T>;
}

const TextInputField = <T extends FieldValues>({
  name,
  label,
  formMethods,
  type = "text",
  placeholder,
  variant = "outlined",
  size = "medium",
  disabled = false,
  required = false,
  fullWidth = true,
  margin = "normal",
  ...props
}: TextInputFieldProps<T>) => {
  const { register, formState: { errors } } = formMethods;

  return (
    <TextField
      label={label}
      type={type}
      placeholder={placeholder}
      variant={variant}
      size={size}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      {...register(name, { valueAsNumber: type === "number" })}
      error={!!errors[name]}
      helperText={(errors[name]?.message as string) || ""}
      {...props}
    />
  );
};

export default TextInputField;