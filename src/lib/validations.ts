/**
 * Obtiene los minutos del día (0-1439) desde una fecha.
 * @deprecated Usar getMinutesFromTimeString para el nuevo schema.
 */
export function getMinutesFromDate(date: Date): number {
  const d = new Date(date);
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * Convierte "HH:MM" a minutos del día.
 */
export function getMinutesFromTimeString(time: string): number {
  const [h = "0", m = "0"] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
}

/**
 * Verifica si dos rangos de tiempo se superponen.
 * Acepta strings "HH:MM" (ej: "09:00", "10:30").
 */
export function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = getMinutesFromTimeString(start1);
  const e1 = getMinutesFromTimeString(end1);
  const s2 = getMinutesFromTimeString(start2);
  const e2 = getMinutesFromTimeString(end2);

  return s1 < e2 && s2 < e1;
}

/**
 * Valida que una fecha no sea en el pasado.
 */
export function isFutureDate(date: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return new Date(date) >= now;
}

/**
 * Formatea una fecha para display.
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea una hora para display.
 */
export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
