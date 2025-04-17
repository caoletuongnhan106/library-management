import * as yup from "yup";

export const readerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10,11}$/, "Phone must be 10-11 digits"),
});