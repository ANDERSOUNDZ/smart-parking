import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DatosService } from '../../core/service/datos.service';

@Component({
  selector: 'app-panel',
  standalone: false,
  templateUrl: './panel.html',
})
export class Panel {
  protected readonly datos = inject(DatosService);

  /** Pantallas pequenas usan menos columnas. */
  protected readonly compacto = toSignal(
    inject(BreakpointObserver)
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((estado) => estado.matches)),
    { initialValue: false },
  );

  protected readonly busqueda = signal<number | null>(null);
  protected readonly filtro = signal<'todos' | 'libres' | 'ocupados'>('todos');

  protected readonly ocupados = computed(() => this.datos.espacios().filter((e) => e.ocupado).length);
  protected readonly porcentaje = computed(() => {
    const total = this.datos.espacios().length;
    return total ? Math.round((this.ocupados() * 100) / total) : 0;
  });
  protected readonly indicadores = computed(() => [
    { titulo: 'Total de espacios', valor: this.datos.espacios().length },
    { titulo: 'Disponibles', valor: this.datos.espacios().length - this.ocupados() },
    { titulo: 'Ocupados', valor: this.ocupados() },
    { titulo: 'Reservas confirmadas', valor: this.datos.reservas().filter((r) => r.estado === 'CONFIRMADA').length },
  ]);
  protected readonly visibles = computed(() =>
    this.datos.espacios().filter(
      (e) =>
        (this.busqueda() === null || e.id === this.busqueda()) &&
        (this.filtro() === 'todos' || e.ocupado === (this.filtro() === 'ocupados')),
    ),
  );
}
