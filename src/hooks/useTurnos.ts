import { useCallback, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Turno } from "@/db";
import { timeRangesOverlap } from "@/lib/validations";

export interface TurnoInput {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  capacidadMaxima: number;
  estado?: "activo" | "inactivo";
}

export interface TurnoUpdate {
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  capacidadMaxima?: number;
  estado?: "activo" | "inactivo";
}

export interface TurnoConDisponibilidad extends Turno {
  reservasConfirmadas: number;
  cupoRestante: number;
}

export interface UseTurnosReturn {
  turnos: Turno[];
  turnosConDisponibilidad: TurnoConDisponibilidad[];
  isLoading: boolean;
  error: string | null;
  createTurno: (input: TurnoInput) => Promise<{ success: boolean; id?: number; error?: string }>;
  updateTurno: (id: number, data: TurnoUpdate) => Promise<{ success: boolean; error?: string }>;
  deleteTurno: (id: number) => Promise<{ success: boolean; error?: string }>;
  getTurnoById: (id: number) => Turno | undefined;
}

export function useTurnos(): UseTurnosReturn {
  const [error, setError] = useState<string | null>(null);

  // Datos reactivos via useLiveQuery (Dexie)
  const turnos = useLiveQuery(() => db.turnos.toArray()) ?? [];
  const reservas = useLiveQuery(() => db.reservas.toArray()) ?? [];

  // Calcular disponibilidad para cada turno
  const turnosConDisponibilidad: TurnoConDisponibilidad[] = turnos.map((turno) => {
    const reservasConfirmadas = reservas.filter(
      (r) => r.turnoId === turno.id && r.estado === "confirmada"
    ).length;
    return {
      ...turno,
      reservasConfirmadas,
      cupoRestante: turno.capacidadMaxima - reservasConfirmadas,
    };
  });

  const getTurnoById = useCallback(
    (id: number): Turno | undefined => turnos.find((t) => t.id === id),
    [turnos]
  );

  // Validar solapamiento usando horaInicio y horaFin en la misma fecha
  const checkOverlap = useCallback(
    (fecha: string, horaInicio: string, horaFin: string, excludeId?: number): boolean => {
      const turnosEnFecha = turnos.filter(
        (t) => t.fecha === fecha && t.estado !== "inactivo" && t.id !== excludeId
      );
      return turnosEnFecha.some((t) =>
        timeRangesOverlap(horaInicio, horaFin, t.horaInicio, t.horaFin)
      );
    },
    [turnos]
  );

  const createTurno = useCallback(
    async (input: TurnoInput): Promise<{ success: boolean; id?: number; error?: string }> => {
      setError(null);

      if (input.horaInicio >= input.horaFin) {
        const msg = "La hora de inicio debe ser anterior a la hora de fin";
        setError(msg);
        return { success: false, error: msg };
      }

      if (checkOverlap(input.fecha, input.horaInicio, input.horaFin)) {
        const msg = "El horario se solapa con otro turno existente";
        setError(msg);
        return { success: false, error: msg };
      }

      try {
        const id = await db.turnos.add({
          fecha: input.fecha,
          horaInicio: input.horaInicio,
          horaFin: input.horaFin,
          capacidadMaxima: input.capacidadMaxima,
          estado: input.estado ?? "activo",
        });
        return { success: true, id };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al crear turno";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    [checkOverlap]
  );

  const updateTurno = useCallback(
    async (id: number, data: TurnoUpdate): Promise<{ success: boolean; error?: string }> => {
      setError(null);

      try {
        // Si cambia fecha u horas, revalidar solapamiento
        if (data.fecha || data.horaInicio || data.horaFin) {
          const existing = turnos.find((t) => t.id === id);
          if (existing) {
            const fecha = data.fecha ?? existing.fecha;
            const horaInicio = data.horaInicio ?? existing.horaInicio;
            const horaFin = data.horaFin ?? existing.horaFin;

            if (horaInicio >= horaFin) {
              const msg = "La hora de inicio debe ser anterior a la hora de fin";
              setError(msg);
              return { success: false, error: msg };
            }

            if (checkOverlap(fecha, horaInicio, horaFin, id)) {
              const msg = "El horario se solapa con otro turno existente";
              setError(msg);
              return { success: false, error: msg };
            }
          }
        }

        await db.turnos.update(id, data);
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al actualizar turno";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    [turnos, checkOverlap]
  );

  const deleteTurno = useCallback(
    async (id: number): Promise<{ success: boolean; error?: string }> => {
      setError(null);
      try {
        await db.turnos.delete(id);
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar turno";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    []
  );

  return {
    turnos,
    turnosConDisponibilidad,
    isLoading: false,
    error,
    createTurno,
    updateTurno,
    deleteTurno,
    getTurnoById,
  };
}
