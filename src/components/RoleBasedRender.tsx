import { ReactNode } from "react";

interface RoleBasedRenderProps {
  role: string | undefined;
  children: ReactNode;
}

const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({ role, children }) => {
  if (role !== "admin") {
    return null;
  }
  return <>{children}</>;
};

export default RoleBasedRender;