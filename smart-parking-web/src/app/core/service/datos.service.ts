import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, forkJoin, merge, switchMap, timer } from 'rxjs';
import { Espacio } from '../model/espacio';
import { Reserva } from '../model/reserva';
import { EspaciosService } from './espacios.service';
import { ReservasService } from './reservas.service';

const INTERVALO_MS = 5000;

/** Datos en vivo compartidos por todas las pantallas. */
@Injectable({ providedIn: 'root' })
export class DatosService {
  private readonly espaciosService = inject(EspaciosService);
  private readonly reservasService = inject(ReservasService);
  private readonly cambios$ = new Subject<void>();

  private readonly estado = toSignal(
    merge(timer(0, INTERVALO_MS), this.cambios$).pipe(
      switchMap(() =>
        forkJoin({ espacios: this.espaciosService.listar(), reservas: this.reservasService.listar() }).pipe(
          // Si un servicio no responde se conservan los ultimos datos recibidos.
          catchError(() => EMPTY),
        ),
      ),
    ),
    { initialValue: { espacios: [] as Espacio[], reservas: [] as Reserva[] } },
  );

  readonly espacios = computed(() => [...this.estado().espacios].sort((a, b) => a.id - b.id));
  readonly reservas = computed(() => this.estado().reservas);

  /** Se llama despues de modificar datos para no esperar al siguiente intervalo. */
  refrescar() {
    this.cambios$.next();
  }
}
