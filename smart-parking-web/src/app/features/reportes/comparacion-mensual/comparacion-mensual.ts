import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ApiService } from '../../../core/api.service';
import { Comparacion } from '../../../core/models';
import { COLOR, PORCENTAJE, enVivo, fechaIso, grafica, serie } from '../reportes.utils';

@Component({
  selector: 'app-comparacion-mensual',
  standalone: false,
  templateUrl: './comparacion-mensual.html',
})
export class ComparacionMensual {
  private readonly api = inject(ApiService);

  protected readonly opciones = PORCENTAJE;
  protected readonly mes = signal(fechaIso(new Date()).slice(0, 7));

  private readonly comparacion = enVivo(toObservable(this.mes).pipe(filter(Boolean)), (mes) =>
    this.api.analitica<Comparacion>('comparacion', { mes }),
  );

  protected readonly datos = computed(() => {
    const c = this.comparacion();
    const meses = c ? [c.anterior, c.seleccionado] : [];
    return grafica(
      meses.map((m) => m.mes),
      serie('Ocupación promedio (%)', meses.map((m) => (m.registros ? m.promedio : null)), COLOR.azul),
    );
  });

  protected readonly variacion = computed(() => {
    const c = this.comparacion();
    if (!c) return 'Sin datos';
    if (c.variacion === null) return 'No hay datos de ambos meses para comparar';
    const tendencia = c.variacion > 0 ? 'aumento' : c.variacion < 0 ? 'disminución' : 'sin cambios';
    return `Variación: ${c.variacion > 0 ? '+' : ''}${c.variacion} puntos (${tendencia})`;
  });
}
