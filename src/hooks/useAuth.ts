import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const { user, isLoading, login, logout } = useAuthContext();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.rol === "admin",
    login,
    logout,
  };
}
