import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-primary">
            Turnero
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin/turnos" 
                  className={`text-sm hover:text-primary ${location.pathname.startsWith('/admin') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  Admin
                </Link>
              </>
            ) : (
              <Link 
                to="/login"
                className={`text-sm hover:text-primary ${location.pathname === '/login' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main><Outlet /></main>
    </div>
  );
}