import { useReservas } from "@/hooks/useReservas";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban } from "lucide-react";

export function ReservasPage() {
  const { reservasConTurno, cancelReserva, error } = useReservas();

  const handleCancelar = async (id: number) => {
    if (confirm("¿Cancelar esta reserva?")) {
      await cancelReserva(id);
    }
  };

  const formatFecha = (date: Date) =>
    new Date(date).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
        <p className="text-muted-foreground">
          Listado de reservas realizadas por los clientes
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reservas ({reservasConTurno.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reservasConTurno.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay reservas registradas
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Carnet</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Fecha Reserva</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservasConTurno.map((reserva) => (
                  <TableRow
                    key={reserva.id}
                    className={reserva.estado === "cancelada" ? "opacity-50" : ""}
                  >
                    <TableCell className="font-medium">{reserva.nombreCliente}</TableCell>
                    <TableCell>{reserva.carnetIdentidad}</TableCell>
                    <TableCell>
                      {reserva.turno ? (
                        <span className="text-sm">
                          {reserva.turno.fecha}
                          <br />
                          <span className="text-muted-foreground">
                            {reserva.turno.horaInicio} – {reserva.turno.horaFin}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Turno eliminado</span>
                      )}
                    </TableCell>
                    <TableCell>{formatFecha(reserva.fechaReserva)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reserva.estado === "confirmada"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {reserva.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      {reserva.estado === "confirmada" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Cancelar reserva"
                          onClick={() => handleCancelar(reserva.id!)}
                        >
                          <Ban className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
