import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";

type LoginForm = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { loginUser } = useAuth();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      await loginUser(data.username, data.password);
    } catch (error) {
      alert("Login failed: Invalid credentials");
    }
  };

  return (
    <Paper sx={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap="10px">
          <TextField label="Username" {...register("username", { required: true })} fullWidth />
          <TextField
            label="Password"
            type="password"
            {...register("password", { required: true })}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Box>
      </form>
      <Typography variant="body2" sx={{ marginTop: "10px" }}>
        Test accounts: <br />
        Admin: username: admin, password: admin123 <br />
        User: username: user, password: user123
      </Typography>
    </Paper>
  );
};

export default Login;