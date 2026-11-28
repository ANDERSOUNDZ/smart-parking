import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../core/api.service';
import { DatosService } from '../../../core/datos.service';
import { Espacio } from '../../../core/models';
import { AccionesService } from '../../../shared/services/acciones.service';

interface Fila extends Espacio {
  reserva?: number;
}

@Component({
  selector: 'app-espacios',
  standalone: false,
  templateUrl: './espacios.html',
})
export class Espacios {
  private readonly datos = inject(DatosService);
  private readonly api = inject(ApiService);
  private readonly acciones = inject(AccionesService);
  private readonly paginador = viewChild(MatPaginator);

  protected readonly columnas = ['id', 'estado', 'reserva', 'acciones'];
  protected readonly tabla = new MatTableDataSource<Fila>();
  protected readonly porId = (_: number, fila: Fila) => fila.id;

  private readonly filas = computed<Fila[]>(() =>
    this.datos.espacios().map((e) => ({
      ...e,
      reserva: this.datos.confirmadas().find((r) => r.idEspacio === e.id)?.id,
    })),
  );

  constructor() {
    effect(() => {
      this.tabla.paginator = this.paginador() ?? null;
      this.tabla.data = this.filas();
    });
  }

  protected nuevo() {
    this.acciones.ejecutar(
      { titulo: 'Nuevo espacio', mensaje: 'ID del espacio', numero: Math.max(0, ...this.filas().map((e) => e.id)) + 1 },
      (id) => this.api.crearEspacio({ id, ocupado: false }),
      'Espacio creado.',
      { 409: 'Ya existe un espacio con ese ID.' },
    );
  }

  protected eliminar({ id, reserva }: Fila) {
    if (reserva) return;
    this.acciones.ejecutar(
      { titulo: 'Confirmar', mensaje: `¿Eliminar el espacio E-${id}?` },
      () => this.api.eliminarEspacio(id),
      `Espacio E-${id} eliminado.`,
      { 404: 'El espacio ya no existe.' },
    );
  }
}
