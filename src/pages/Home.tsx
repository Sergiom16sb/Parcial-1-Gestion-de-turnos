import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTurnos, type TurnoConDisponibilidad } from "@/hooks/useTurnos";
import { useReservas } from "@/hooks/useReservas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarClock, Users, Clock } from "lucide-react";

export function Home() {
  const navigate = useNavigate();
  const { turnosConDisponibilidad } = useTurnos();
  const { createReserva } = useReservas();

  // Modal de reserva
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<TurnoConDisponibilidad | null>(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [carnetIdentidad, setCarnetIdentidad] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleReservar = (turno: TurnoConDisponibilidad) => {
    setTurnoSeleccionado(turno);
    setNombreCliente("");
    setCarnetIdentidad("");
    setSubmitError(null);
    setSuccessMsg(null);
  };

  const handleCloseModal = () => {
    setTurnoSeleccionado(null);
    setSubmitError(null);
    setSuccessMsg(null);
  };

  const handleConfirmarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnoSeleccionado) return;

    setSubmitError(null);
    setIsSubmitting(true);

    const result = await createReserva({
      turnoId: turnoSeleccionado.id!,
      nombreCliente: nombreCliente.trim(),
      carnetIdentidad: carnetIdentidad.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg("¡Reserva confirmada exitosamente!");
      setTimeout(() => handleCloseModal(), 2000);
    } else {
      setSubmitError(result.error || "Error al crear la reserva");
    }
  };

  // Solo mostrar turnos activos
  const turnosActivos = turnosConDisponibilidad.filter((t) => t.estado === "activo");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Turnos Disponibles</h1>
          <p className="text-muted-foreground mt-1">
            Seleccioná un turno para reservar tu lugar
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/login")}>
          Login Administrador
        </Button>
      </div>

      {/* Lista de turnos */}
      {turnosActivos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarClock className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg">No hay turnos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turnosActivos.map((turno) => {
            const sinCupo = turno.cupoRestante <= 0;
            return (
              <Card
                key={turno.id}
                className={`transition-shadow ${sinCupo ? "opacity-60" : "hover:shadow-md cursor-pointer"}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    {turno.fecha}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{turno.horaInicio} – {turno.horaFin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>
                      Cupo restante:{" "}
                      <span className={sinCupo ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                        {turno.cupoRestante} / {turno.capacidadMaxima}
                      </span>
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    disabled={sinCupo}
                    onClick={() => handleReservar(turno)}
                  >
                    {sinCupo ? "Sin cupo" : "Reservar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de reserva */}
      <Dialog open={!!turnoSeleccionado} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservar Turno</DialogTitle>
            <DialogDescription>
              {turnoSeleccionado && (
                <>
                  {turnoSeleccionado.fecha} — {turnoSeleccionado.horaInicio} a {turnoSeleccionado.horaFin}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="text-center py-6">
              <p className="text-green-600 font-semibold text-lg">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleConfirmarReserva} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombreCliente">Nombre Completo</Label>
                <Input
                  id="nombreCliente"
                  placeholder="Juan García López"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carnetIdentidad">Carnet de Identidad</Label>
                <Input
                  id="carnetIdentidad"
                  placeholder="1234567"
                  value={carnetIdentidad}
                  onChange={(e) => setCarnetIdentidad(e.target.value)}
                  required
                />
              </div>

              {submitError && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  {submitError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
