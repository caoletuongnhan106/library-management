import { useEffect, useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { login } from "../api/mockApi";
import { useAuth } from "../context/AuthContext";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: loginUser, user } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/books", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const userData = await login(username, password);
      loginUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/books", { replace: true });
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <LibraryBooksIcon sx={{ fontSize: 50, color: "primary.main" }} />
        </Box>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        {error && (
          <Typography color="error" gutterBottom align="center">
            {error}
          </Typography>
        )}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{ mt: 2, bgcolor: "primary.main", py: 1.5 }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;