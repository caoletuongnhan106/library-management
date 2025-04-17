
export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
};

export type Reader = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type Borrow = {
  id: number;
  bookId: number;
  readerId: number;
  borrowDate: string;
  returnDate?: string;
};

export type User = { 
  id: number;
  username: string;
  password: string; 
  role: "admin" | "user";
};

let books: Book[] = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling", year: 1997, genre: "Fantasy" },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" },
  { id: 3, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
];

let readers: Reader[] = [
  { id: 1, name: "Nguyen Van A", email: "a@gmail.com", phone: "0901234567" },
  { id: 2, name: "Tran Thi B", email: "b@gmail.com", phone: "0909876543" },
];

let borrows: Borrow[] = [
  { id: 1, bookId: 1, readerId: 1, borrowDate: "2025-04-10" },
];

let users: User[] = [
  { id: 1, username: "admin", password: "123", role: "admin" },
  { id: 2, username: "user", password: "123", role: "user" },
];

let currentUser: User | null = null;

(function initializeCurrentUser() {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
})();

export const login = async (username: string, password: string): Promise<User> => {
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem("user", JSON.stringify(user));
    return new Promise((resolve) => setTimeout(() => resolve(user), 500));
  }
  throw new Error("Invalid credentials");
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    currentUser = null;
    localStorage.removeItem("user");
    setTimeout(() => resolve(), 500);
  });
};

export const getCurrentUser = (): User | null => currentUser;
// Book APIs
export const getBooks = async (): Promise<Book[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(books), 500));
};

export const addBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const newBook = { id: books.length + 1, ...book };
  books.push(newBook);
  return new Promise((resolve) => setTimeout(() => resolve(newBook), 500));
};

export const updateBook = async (id: number, updatedBook: Omit<Book, "id">): Promise<Book> => {
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = { id, ...updatedBook };
    return new Promise((resolve) => setTimeout(() => resolve(books[index]), 500));
  }
  throw new Error("Book not found");
};

export const deleteBook = async (id: number): Promise<{ success: boolean }> => {
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  }
  throw new Error("Book not found");
};

// Reader APIs
export const getReaders = async (): Promise<Reader[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(readers), 500));
};

export const addReader = async (reader: Omit<Reader, "id">): Promise<Reader> => {
  const newReader = { id: readers.length + 1, ...reader };
  readers.push(newReader);
  return new Promise((resolve) => setTimeout(() => resolve(newReader), 500));
};

export const updateReader = async (id: number, updatedReader: Omit<Reader, "id">): Promise<Reader> => {
  const index = readers.findIndex((reader) => reader.id === id);
  if (index !== -1) {
    readers[index] = { id, ...updatedReader };
    return new Promise((resolve) => setTimeout(() => resolve(readers[index]), 500));
  }
  throw new Error("Reader not found");
};

export const deleteReader = async (id: number): Promise<{ success: boolean }> => {
  const index = readers.findIndex((reader) => reader.id === id);
  if (index !== -1) {
    readers.splice(index, 1);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  }
  throw new Error("Reader not found");
};

// Borrow APIs
export const getBorrows = async (): Promise<Borrow[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(borrows), 500));
};

export const borrowBook = async (borrow: Omit<Borrow, "id">): Promise<Borrow> => {
  const newBorrow = { id: borrows.length + 1, ...borrow };
  borrows.push(newBorrow);
  return new Promise((resolve) => setTimeout(() => resolve(newBorrow), 500));
};

export const returnBook = async (id: number): Promise<Borrow> => {
  const index = borrows.findIndex((borrow) => borrow.id === id);
  if (index !== -1) {
    borrows[index] = { ...borrows[index], returnDate: new Date().toISOString().split("T")[0] };
    return new Promise((resolve) => setTimeout(() => resolve(borrows[index]), 500));
  }
  throw new Error("Borrow record not found");
};

// Statistics APIs
export const getStatistics = async (): Promise<{
  totalBooks: number;
  topAuthor: string;
  topYear: number;
}> => {
  const totalBooks = books.length;

  const authorCount = books.reduce((acc, book) => {
    acc[book.author] = (acc[book.author] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topAuthor = books.length > 0
    ? Object.keys(authorCount).reduce((a, b) => (authorCount[a] > authorCount[b] ? a : b))
    : "N/A"; 

  const yearCount = books.reduce((acc, book) => {
    acc[book.year] = (acc[book.year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const topYear = books.length > 0
    ? Number(Object.keys(yearCount).reduce((a, b) => (yearCount[Number(a)] > yearCount[Number(b)] ? a : b)))
    : 0; 
    
    const genreCounts = books.reduce((acc: { [key: string]: number }, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

  return new Promise((resolve) =>
    setTimeout(() => resolve({ totalBooks, topAuthor, topYear }), 500)
  );
};