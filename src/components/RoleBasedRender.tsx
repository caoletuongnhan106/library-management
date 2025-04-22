import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RoleBasedRenderProps {
  allowRole: string[];
  children: ReactNode;
}

const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({ allowRole, children }) => {
  const { user } = useAuth();
  const role = user?.role;

  if (!role || !allowRole.includes(role)) {
    return null;
  }
  return <>{children}</>;
};

export default RoleBasedRender;