import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
