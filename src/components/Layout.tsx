import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import { logout } from "../api/mockApi";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; // Import icon

const Layout: React.FC = () => {
  const { user, logout: logoutUser } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      hasRedirected.current = false;
    } else if (!hasRedirected.current) {
      if (window.location.pathname === "/" || window.location.pathname !== "/books") {
        navigate("/books", { replace: true });
        hasRedirected.current = true;
      }
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    logoutUser();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
            <LibraryBooksIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Library System
          </Typography>
          {user && (
            <>
              <Button
                color="inherit"
                component={NavLink}
                to="/books"
                sx={{
                  mx: 1,
                  "&.active": {
                    borderBottom: "2px solid white",
                    fontWeight: "bold",
                  },
                  "&:hover": {
                    bgcolor: "primary.light",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Books
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/readers"
                sx={{
                  mx: 1,
                  "&.active": {
                    borderBottom: "2px solid white",
                    fontWeight: "bold",
                  },
                  "&:hover": {
                    bgcolor: "primary.light",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Readers
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/borrows"
                sx={{
                  mx: 1,
                  "&.active": {
                    borderBottom: "2px solid white",
                    fontWeight: "bold",
                  },
                  "&:hover": {
                    bgcolor: "primary.light",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Borrows
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/statistics"
                sx={{
                  mx: 1,
                  "&.active": {
                    borderBottom: "2px solid white",
                    fontWeight: "bold",
                  },
                  "&:hover": {
                    bgcolor: "primary.light",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Statistics
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  mx: 1,
                  "&:hover": {
                    bgcolor: "secondary.main",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  );
};

export default Layout;