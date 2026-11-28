import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { filter, switchMap } from 'rxjs';
import { Espacio } from '../../core/model/espacio';
import { DatosService } from '../../core/service/datos.service';
import { EspaciosService } from '../../core/service/espacios.service';
import { NotificacionService } from '../../core/service/notificacion.service';
import { ConfirmarDialog } from '../../shared/confirmar-dialog';
import { NuevoEspacioDialog } from './nuevo-espacio-dialog';

interface Fila extends Espacio {
  /** ID de la reserva confirmada, si la tiene. */
  reserva?: number;
}

@Component({
  selector: 'app-lista-espacios',
  standalone: false,
  templateUrl: './lista-espacios.html',
})
export class ListaEspacios {
  private readonly datos = inject(DatosService);
  private readonly espaciosService = inject(EspaciosService);
  private readonly notificacion = inject(NotificacionService);
  private readonly dialog = inject(MatDialog);
  private readonly paginador = viewChild(MatPaginator);

  protected readonly columnas = ['id', 'estado', 'reserva', 'acciones'];
  protected readonly tabla = new MatTableDataSource<Fila>();
  protected readonly porId = (_: number, fila: Fila) => fila.id;

  private readonly filas = computed<Fila[]>(() =>
    this.datos.espacios().map((e) => ({
      ...e,
      reserva: this.datos.reservas().find((r) => r.idEspacio === e.id && r.estado === 'CONFIRMADA')?.id,
    })),
  );

  constructor() {
    effect(() => {
      this.tabla.paginator = this.paginador() ?? null;
      this.tabla.data = this.filas();
    });
  }

  protected nuevo() {
    const siguiente = Math.max(0, ...this.filas().map((e) => e.id)) + 1;
    this.dialog
      .open(NuevoEspacioDialog, { data: siguiente })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((id: number) => this.espaciosService.crear({ id, ocupado: false })),
      )
      .subscribe(this.alTerminar('Espacio creado.', { 409: 'Ya existe un espacio con ese ID.' }));
  }

  protected eliminar(fila: Fila) {
    if (fila.reserva) return;
    this.dialog
      .open(ConfirmarDialog, { data: `¿Eliminar el espacio E-${fila.id}?` })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.espaciosService.eliminar(fila.id)),
      )
      .subscribe(this.alTerminar(`Espacio E-${fila.id} eliminado.`, { 404: 'El espacio ya no existe.' }));
  }

  private alTerminar(mensaje: string, errores: Record<number, string> = {}) {
    return {
      next: () => {
        this.notificacion.mostrar(mensaje);
        this.datos.refrescar();
      },
      error: (e: Parameters<NotificacionService['error']>[0]) => this.notificacion.error(e, errores),
    };
  }
}
