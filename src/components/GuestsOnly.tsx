
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function GuestOnly() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Verificando sessão...</div>;
  }

  if (user) {
    const from = location.state?.from;

    const redirectTo = from
      ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
      : "/";

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet/>;
}