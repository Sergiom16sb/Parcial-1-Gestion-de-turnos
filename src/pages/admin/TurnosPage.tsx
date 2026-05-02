import { useState } from "react";
import { useTurnos, type TurnoInput, type TurnoUpdate } from "@/hooks/useTurnos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

const today = new Date().toISOString().split("T")[0]!;

const defaultForm: TurnoInput = {
  fecha: today,
  horaInicio: "09:00",
  horaFin: "10:00",
  capacidadMaxima: 5,
  estado: "activo",
};

export function TurnosPage() {
  const { turnos, turnosConDisponibilidad, createTurno, updateTurno, deleteTurno, error } = useTurnos();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TurnoInput>(defaultForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setSubmitError(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (turno: typeof turnos[0]) => {
    setFormData({
      fecha: turno.fecha,
      horaInicio: turno.horaInicio,
      horaFin: turno.horaFin,
      capacidadMaxima: turno.capacidadMaxima,
      estado: turno.estado,
    });
    setEditingId(turno.id!);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const result = editingId
      ? await updateTurno(editingId, formData as TurnoUpdate)
      : await createTurno(formData);

    if (result.success) {
      setIsOpen(false);
      resetForm();
    } else {
      setSubmitError(result.error || "Error desconocido");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este turno?")) {
      await deleteTurno(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Crear, editar y eliminar turnos</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Turno" : "Crear Turno"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Modificá los datos del turno" : "Completá los datos del nuevo turno"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora Inicio</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora Fin</Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={formData.horaFin}
                    onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacidadMaxima">Capacidad Máxima</Label>
                <Input
                  id="capacidadMaxima"
                  type="number"
                  min="1"
                  value={formData.capacidadMaxima}
                  onChange={(e) =>
                    setFormData({ ...formData, capacidadMaxima: parseInt(e.target.value) || 1 })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(v) =>
                    setFormData({ ...formData, estado: v as TurnoInput["estado"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(submitError || error) && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  {submitError || error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Turnos ({turnos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {turnos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay turnos registrados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora Inicio</TableHead>
                  <TableHead>Hora Fin</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Cupo Restante</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turnosConDisponibilidad.map((turno) => (
                  <TableRow key={turno.id}>
                    <TableCell>{turno.fecha}</TableCell>
                    <TableCell>{turno.horaInicio}</TableCell>
                    <TableCell>{turno.horaFin}</TableCell>
                    <TableCell>{turno.capacidadMaxima}</TableCell>
                    <TableCell>
                      <span
                        className={
                          turno.cupoRestante <= 0
                            ? "text-red-500 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {turno.cupoRestante}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          turno.estado === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {turno.estado}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(turno)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(turno.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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
