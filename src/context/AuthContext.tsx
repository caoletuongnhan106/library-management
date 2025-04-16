import { createContext, useContext, useState, ReactNode } from "react";
import { login } from "../api/mockApi";

type User = {
  id: number;
  username: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginUser = async (username: string, password: string) => {
    const loggedInUser = await login(username, password);
    setUser(loggedInUser);
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loginUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};