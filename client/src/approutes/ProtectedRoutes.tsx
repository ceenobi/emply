import { Navigate } from "react-router-dom";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { toast } from "sonner";

export const PrivateRoutes: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, user } = useAuthProvider() as {
    user: Userinfo;
    isAuthenticated: boolean;
  };
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    toast.info("Please verify your email to access your dashboard");
    return <Navigate to="/verify-account" replace />;
  }
  return children;
};

export const PublicRoutes: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, user } = useAuthProvider() as {
    user: Userinfo;
    isAuthenticated: boolean;
  };

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const AdminRoutes: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const authRole = ["admin", "super-admin"];
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  if (!authRole.includes(user.role)) {
    toast.error("Unauthorized access");
    return <Navigate to="/" replace />;
  }
  return children;
};
