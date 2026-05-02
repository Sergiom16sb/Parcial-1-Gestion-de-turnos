import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { TurnosPage } from "@/pages/admin/TurnosPage";
import { ReservasPage } from "@/pages/admin/ReservasPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/turnos" replace />} />
          <Route path="turnos" element={<TurnosPage />} />
          <Route path="reservas" element={<ReservasPage />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;