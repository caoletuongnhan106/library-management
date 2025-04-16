// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, Container, Typography, Tabs, Tab, Button, Box } from "@mui/material";
import { useState } from "react";
import BookManagement from "./components/BookManagement";
import ReaderManagement from "./components/ReaderManagement";
import BorrowManagement from "./components/BorrowManagement";
import Statistics from "./components/Statistics";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!user) {
    return <Login />;
  }

  return (
    <Container sx={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Library Management System
        </Typography>
        <Box>
          <Typography variant="body1" display="inline" sx={{ marginRight: "10px" }}>
            Welcome, {user.username} ({user.role})
          </Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Books" />
        <Tab label="Readers" />
        <Tab label="Borrows" />
        <Tab label="Statistics" />
      </Tabs>
      {tab === 0 && <BookManagement />}
      {tab === 1 && <ReaderManagement />}
      {tab === 2 && <BorrowManagement />}
      {tab === 3 && <Statistics />}
    </Container>
  );
};

const AppWrapper: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CssBaseline />
      <App />
    </AuthProvider>
  </QueryClientProvider>
);

export default AppWrapper;