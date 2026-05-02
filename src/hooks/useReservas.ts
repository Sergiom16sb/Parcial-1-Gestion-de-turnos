import { useCallback, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Reserva, type Turno } from "@/db";

export interface ReservaInput {
  turnoId: number;
  nombreCliente: string;
  carnetIdentidad: string;
}

export interface ReservaConTurno extends Reserva {
  turno?: Turno;
}

export interface UseReservasReturn {
  reservas: Reserva[];
  reservasConTurno: ReservaConTurno[];
  isLoading: boolean;
  error: string | null;
  createReserva: (input: ReservaInput) => Promise<{ success: boolean; id?: number; error?: string }>;
  cancelReserva: (id: number) => Promise<{ success: boolean; error?: string }>;
  getReservaById: (id: number) => Reserva | undefined;
}

export function useReservas(): UseReservasReturn {
  const [error, setError] = useState<string | null>(null);

  // Datos reactivos via useLiveQuery
  const reservas = useLiveQuery(() => db.reservas.toArray()) ?? [];
  const turnos = useLiveQuery(() => db.turnos.toArray()) ?? [];

  // JOIN manual: enriquecer cada reserva con los datos del turno asociado
  const reservasConTurno: ReservaConTurno[] = reservas.map((reserva) => ({
    ...reserva,
    turno: turnos.find((t) => t.id === reserva.turnoId),
  }));

  const getReservaById = useCallback(
    (id: number): Reserva | undefined => reservas.find((r) => r.id === id),
    [reservas]
  );

  // Crear reserva verificando que el turno tenga cupo disponible
  const createReserva = useCallback(
    async (input: ReservaInput): Promise<{ success: boolean; id?: number; error?: string }> => {
      setError(null);

      try {
        const turno = await db.turnos.get(input.turnoId);

        if (!turno) {
          const msg = "El turno seleccionado no existe";
          setError(msg);
          return { success: false, error: msg };
        }

        if (turno.estado === "inactivo") {
          const msg = "El turno no está disponible";
          setError(msg);
          return { success: false, error: msg };
        }

        // Contar reservas confirmadas para este turno
        const reservasConfirmadas = await db.reservas
          .where("turnoId")
          .equals(input.turnoId)
          .filter((r) => r.estado === "confirmada")
          .count();

        if (reservasConfirmadas >= turno.capacidadMaxima) {
          const msg = "El turno no tiene cupo disponible";
          setError(msg);
          return { success: false, error: msg };
        }

        const id = await db.reservas.add({
          turnoId: input.turnoId,
          nombreCliente: input.nombreCliente,
          carnetIdentidad: input.carnetIdentidad,
          fechaReserva: new Date(),
          estado: "confirmada",
        });

        return { success: true, id };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al crear reserva";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    []
  );

  // Cancelar reserva: cambia estado a "cancelada" (no borra)
  const cancelReserva = useCallback(
    async (id: number): Promise<{ success: boolean; error?: string }> => {
      setError(null);
      try {
        await db.reservas.update(id, { estado: "cancelada" });
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al cancelar reserva";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    []
  );

  return {
    reservas,
    reservasConTurno,
    isLoading: false,
    error,
    createReserva,
    cancelReserva,
    getReservaById,
  };
}
