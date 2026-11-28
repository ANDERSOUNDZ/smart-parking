import { Component, inject, input, signal } from '@angular/core';
import { Observable, finalize, forkJoin } from 'rxjs';
import { ApiService } from '../../../core/api.service';
import { DatosService } from '../../../core/datos.service';
import { Espacio } from '../../../core/models';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-boton-espacio',
  standalone: false,
  templateUrl: './boton-espacio.html',
})
export class BotonEspacio {
  readonly espacio = input.required<Espacio>();

  private readonly api = inject(ApiService);
  private readonly datos = inject(DatosService);
  private readonly acciones = inject(AccionesService);
  protected readonly enCurso = signal(false);

  protected ejecutar() {
    const { id, ocupado } = this.espacio();
    const activas = this.datos.confirmadas().filter((r) => r.idEspacio === id);
    const numeros = activas.map((r) => `#${r.id}`).join(', ');

    const [mensaje, accion, exito]: [string, Observable<unknown>, string] = !ocupado
      ? [`¿Reservar el espacio E-${id}?`, this.api.reservar(id), `Reserva creada en E-${id}.`]
      : activas.length
        ? [
            `Se cancelará la reserva ${numeros} y se liberará el espacio E-${id}. ¿Continuar?`,
            forkJoin(activas.map((r) => this.api.cancelar(r.id))),
            `Espacio E-${id} liberado.`,
          ]
        : [
            `¿Liberar el espacio E-${id}?`,
            this.api.actualizarEspacio({ id, ocupado: false }),
            `Espacio E-${id} liberado.`,
          ];

    this.acciones.ejecutar(
      { titulo: 'Confirmar', mensaje },
      () => {
        this.enCurso.set(true);
        return accion.pipe(finalize(() => this.enCurso.set(false)));
      },
      exito,
      {
        409: 'El estado cambió: el espacio ya está ocupado o la reserva ya está cancelada.',
        404: 'El espacio o la reserva ya no existe.',
      },
    );
  }
}
