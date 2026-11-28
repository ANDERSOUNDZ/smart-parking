import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, finalize, forkJoin, switchMap } from 'rxjs';
import { Espacio } from '../core/model/espacio';
import { DatosService } from '../core/service/datos.service';
import { EspaciosService } from '../core/service/espacios.service';
import { NotificacionService } from '../core/service/notificacion.service';
import { ReservasService } from '../core/service/reservas.service';
import { ConfirmarDialog } from './confirmar-dialog';

/** Boton unico de un espacio: reserva si esta disponible y libera si esta ocupado. */
@Component({
  selector: 'app-boton-espacio',
  standalone: false,
  template: `
    <button matButton [disabled]="enCurso()" (click)="ejecutar()">
      {{ espacio().ocupado ? 'Liberar' : 'Reservar' }}
    </button>
  `,
})
export class BotonEspacio {
  readonly espacio = input.required<Espacio>();

  private readonly datos = inject(DatosService);
  private readonly espaciosService = inject(EspaciosService);
  private readonly reservasService = inject(ReservasService);
  private readonly notificacion = inject(NotificacionService);
  private readonly dialog = inject(MatDialog);

  protected readonly enCurso = signal(false);

  protected ejecutar() {
    const { id, ocupado } = this.espacio();
    const activas = this.datos.reservas().filter((r) => r.idEspacio === id && r.estado === 'CONFIRMADA');

    if (!ocupado) {
      this.confirmar(`¿Reservar el espacio E-${id}?`, this.reservasService.crear(id), `Reserva creada en E-${id}.`);
    } else if (activas.length) {
      // Cancelar la reserva hace que el backend libere el espacio.
      const numeros = activas.map((r) => `#${r.id}`).join(', ');
      this.confirmar(
        `Se cancelará la reserva ${numeros} y se liberará el espacio E-${id}. ¿Continuar?`,
        forkJoin(activas.map((r) => this.reservasService.cancelar(r.id))),
        `Espacio E-${id} liberado.`,
      );
    } else {
      this.confirmar(
        `¿Liberar el espacio E-${id}?`,
        this.espaciosService.actualizar({ id, ocupado: false }),
        `Espacio E-${id} liberado.`,
      );
    }
  }

  private confirmar(pregunta: string, accion: Observable<unknown>, exito: string) {
    this.dialog
      .open(ConfirmarDialog, { data: pregunta })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          this.enCurso.set(true);
          return accion.pipe(finalize(() => this.enCurso.set(false)));
        }),
      )
      .subscribe({
        next: () => {
          this.notificacion.mostrar(exito);
          this.datos.refrescar();
        },
        error: (e: HttpErrorResponse) => {
          this.notificacion.error(e, {
            409: 'El estado cambió: el espacio ya está ocupado o la reserva ya está cancelada.',
            404: 'El espacio o la reserva ya no existe.',
          });
          this.datos.refrescar();
        },
      });
  }
}
