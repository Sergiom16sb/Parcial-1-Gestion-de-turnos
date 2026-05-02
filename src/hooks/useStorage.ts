import { db, type Turno, type Reserva } from "@/db";

/**
 * useStorage encapsula todas las operaciones de lectura y escritura
 * sobre IndexedDB via Dexie. Expone funciones específicas por dominio.
 *
 * Se eligió IndexedDB (via Dexie) sobre localStorage porque:
 * - Soporta consultas por índices (where, equals) sin cargar todo en memoria
 * - Capacidad de almacenamiento mucho mayor (cientos de MB vs ~5 MB)
 * - API asíncrona no bloqueante
 * - Soporte nativo para relaciones entre tablas (turnoId en reservas)
 */
export function useStorage() {
  // ── Turnos ────────────────────────────────────────────────────────────────

  const getTurnos = (): Promise<Turno[]> =>
    db.turnos.toArray();

  const addTurno = (turno: Omit<Turno, "id">): Promise<number> =>
    db.turnos.add(turno);

  const updateTurno = (id: number, data: Partial<Omit<Turno, "id">>): Promise<number> =>
    db.turnos.update(id, data);

  const deleteTurno = (id: number): Promise<void> =>
    db.turnos.delete(id);

  // ── Reservas ──────────────────────────────────────────────────────────────

  const getReservas = (): Promise<Reserva[]> =>
    db.reservas.toArray();

  const addReserva = (reserva: Omit<Reserva, "id">): Promise<number> =>
    db.reservas.add(reserva);

  const cancelReserva = (id: number): Promise<number> =>
    db.reservas.update(id, { estado: "cancelada" });

  // ── Usuarios ─────────────────────────────────────────────────────────────

  const getUsuarioByEmail = (email: string) =>
    db.usuarios.where("email").equals(email).first();

  return {
    getTurnos,
    addTurno,
    updateTurno,
    deleteTurno,
    getReservas,
    addReserva,
    cancelReserva,
    getUsuarioByEmail,
  };
}

export default useStorage;
