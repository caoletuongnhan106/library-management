import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Màu xanh dương đậm cho các thành phần chính (navbar, nút)
      light: "#42a5f5", // Xanh dương nhạt cho hover
    },
    secondary: {
      main: "#f50057", // Màu hồng cho các nút Delete hoặc điểm nhấn
    },
    background: {
      default: "#f4f6f8", // Nền xám nhạt cho toàn ứng dụng
      paper: "#ffffff", // Nền trắng cho các thành phần Paper
    },
    text: {
      primary: "#333333", // Màu chữ chính
      secondary: "#666666", // Màu chữ phụ
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h5: {
      fontWeight: 600,
      color: "#1976d2",
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#f9f9f9", // Màu xen kẽ cho các dòng
          },
          "&:hover": {
            backgroundColor: "#e3f2fd", // Hiệu ứng hover cho dòng
            transition: "background-color 0.3s ease",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#1976d2",
          color: "#ffffff",
          fontWeight: 600,
        },
        body: {
          color: "#333333",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default theme;