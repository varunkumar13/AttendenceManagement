import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = sessionStorage.getItem("key");

  if (!token) {
    sessionStorage.clear();

    return <Navigate to="/" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded.role || decoded.user_role || decoded.type;

    if (!role || !allowedRoles.includes(role)) {
        sessionStorage.clear();

      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    sessionStorage.clear();

    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
