import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import BookManagement from "./pages/BookManagement";
import ReaderManagement from "./pages/ReaderManagement";
import BorrowManagement from "./pages/BorrowManagement";
import Statistics from "./pages/Statistics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Import theme

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<Layout />}>
                <Route path="/books" element={<BookManagement />} />
                <Route path="/readers" element={<ReaderManagement />} />
                <Route path="/borrows" element={<BorrowManagement />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/" element={<BookManagement />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;