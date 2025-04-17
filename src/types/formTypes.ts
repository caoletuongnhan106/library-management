import { Book, Reader } from "../api/mockApi";

export type BookFormData = Required<Omit<Book, "id">>;
export type ReaderFormData = Required<Omit<Reader, "id">>;