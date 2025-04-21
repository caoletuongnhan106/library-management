import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RestrictedProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const Restricted: React.FC<RestrictedProps> = ({ children, allowedRoles = ["admin"] }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default Restricted;