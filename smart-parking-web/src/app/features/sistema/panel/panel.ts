import { Component, computed, inject, signal } from '@angular/core';
import { DatosService } from '../../../core/datos.service';
import { pantallaCompacta } from '../../../shared/pantalla-compacta';

@Component({
  selector: 'app-panel',
  standalone: false,
  templateUrl: './panel.html',
})
export class Panel {
  protected readonly datos = inject(DatosService);
  protected readonly compacto = pantallaCompacta();
  protected readonly busqueda = signal<number | null>(null);
  protected readonly filtro = signal<'todos' | 'libres' | 'ocupados'>('todos');

  private readonly ocupados = computed(() => this.datos.espacios().filter((e) => e.ocupado).length);
  protected readonly porcentaje = computed(() => {
    const total = this.datos.espacios().length;
    return total ? Math.round((this.ocupados() * 100) / total) : 0;
  });
  protected readonly indicadores = computed(() => [
    { titulo: 'Total de espacios', valor: this.datos.espacios().length },
    { titulo: 'Disponibles', valor: this.datos.espacios().length - this.ocupados() },
    { titulo: 'Ocupados', valor: this.ocupados() },
    { titulo: 'Reservas confirmadas', valor: this.datos.confirmadas().length },
  ]);
  protected readonly visibles = computed(() =>
    this.datos.espacios().filter(
      (e) =>
        (this.busqueda() === null || e.id === this.busqueda()) &&
        (this.filtro() === 'todos' || e.ocupado === (this.filtro() === 'ocupados')),
    ),
  );
}
