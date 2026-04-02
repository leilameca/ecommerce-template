import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROUTE_PATHS } from "./route-paths";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="rounded-[2rem] border border-zinc-200/80 bg-white px-8 py-6 text-sm text-zinc-500 shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
          Loading admin session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.adminLogin}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
