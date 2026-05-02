import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { db, type Usuario } from "@/db";

const AUTH_STORAGE_KEY = "turnero_auth";

export interface AuthUser {
  id: number;
  email: string;
  rol: "admin" | "user";
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const foundUser = await db.usuarios.where("email").equals(email).first();

      if (!foundUser) {
        return { success: false, error: "Credenciales inválidas" };
      }

      if (btoa(password) !== foundUser.passwordHash) {
        return { success: false, error: "Credenciales inválidas" };
      }

      const authUser: AuthUser = {
        id: foundUser.id!,
        email: foundUser.email,
        rol: foundUser.rol,
      };

      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error al iniciar sesión" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
