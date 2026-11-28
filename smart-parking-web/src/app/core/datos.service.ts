import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, forkJoin, merge, switchMap, timer } from 'rxjs';
import { ApiService } from './api.service';
import { Espacio, Reserva } from './models';

@Injectable({ providedIn: 'root' })
export class DatosService {
  private readonly api = inject(ApiService);
  private readonly cambios$ = new Subject<void>();

  private readonly estado = toSignal(
    merge(timer(0, 5000), this.cambios$).pipe(
      switchMap(() =>
        forkJoin({ espacios: this.api.espacios(), reservas: this.api.reservas() }).pipe(catchError(() => EMPTY)),
      ),
    ),
    { initialValue: { espacios: [] as Espacio[], reservas: [] as Reserva[] } },
  );

  readonly espacios = computed(() => [...this.estado().espacios].sort((a, b) => a.id - b.id));
  readonly confirmadas = computed(() => this.estado().reservas.filter((r) => r.estado === 'CONFIRMADA'));

  refrescar() {
    this.cambios$.next();
  }
}
