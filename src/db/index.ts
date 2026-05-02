import Dexie, { type Table } from "dexie";

export type { Table };

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Turno {
  id?: number;
  fecha: string;           // "2025-06-15"
  horaInicio: string;      // "09:00"
  horaFin: string;         // "10:00"
  capacidadMaxima: number;
  estado: "activo" | "inactivo";
}

export interface Reserva {
  id?: number;
  turnoId: number;
  nombreCliente: string;
  carnetIdentidad: string;
  fechaReserva: Date;
  estado: "confirmada" | "cancelada";
}

export interface Usuario {
  id?: number;
  email: string;
  passwordHash: string;    // btoa encoded
  rol: "admin" | "user";
}

// ── Database class ─────────────────────────────────────────────────────────────

export class TurnosDB extends Dexie {
  turnos!: Table<Turno>;
  reservas!: Table<Reserva>;
  usuarios!: Table<Usuario>;

  constructor() {
    super("TurnosDB");

    this.version(2).stores({
      turnos: "++id, fecha, estado",
      reservas: "++id, turnoId, estado",
      usuarios: "++id, email",
    });
  }
}

// ── Singleton ──────────────────────────────────────────────────────────────────

export const db = new TurnosDB();

// ── Seed ───────────────────────────────────────────────────────────────────────

export async function seedDefaultAdmin(): Promise<void> {
  const existing = await db.usuarios.where("email").equals("admin@admin.com").first();

  if (!existing) {
    await db.usuarios.add({
      email: "admin@admin.com",
      passwordHash: btoa("admin123"),
      rol: "admin",
    });
  }
}

export async function initDB(): Promise<void> {
  await seedDefaultAdmin();
}
