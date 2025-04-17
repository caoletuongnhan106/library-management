import * as yup from "yup";

const currentYear = new Date().getFullYear(); // 2025

export const bookSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  author: yup
    .string()
    .required("Author is required")
    .min(3, "Author must be at least 3 characters"),
  year: yup
    .number()
    .required("Year is required")
    .min(1900, "Year must be at least 1900")
    .max(currentYear, `Year cannot be greater than ${currentYear}`)
    .typeError("Year must be a number"),
  genre: yup
    .string()
    .required("Genre is required")
    .min(3, "Genre must be at least 3 characters"),
});