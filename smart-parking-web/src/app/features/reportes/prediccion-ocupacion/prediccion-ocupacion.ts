import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/api.service';
import { Prediccion } from '../../../core/models';
import { COLOR, PORCENTAJE, enVivo, grafica, hora, serie } from '../reportes.utils';

@Component({
  selector: 'app-prediccion-ocupacion',
  standalone: false,
  templateUrl: './prediccion-ocupacion.html',
})
export class PrediccionOcupacion {
  private readonly api = inject(ApiService);

  protected readonly opciones = PORCENTAJE;
  protected readonly horas = signal(6);

  private readonly prediccion = enVivo(toObservable(this.horas), (horas) =>
    this.api.analitica<Prediccion[]>('prediccion', { horas }),
  );

  protected readonly datos = computed(() => {
    const lista = this.prediccion() ?? [];
    return grafica(
      lista.map((p) => hora(new Date(p.fechaHora).getHours())),
      serie('Ocupación estimada (%)', lista.map((p) => p.ocupacion), COLOR.azul),
    );
  });

  private readonly estimados = computed(() =>
    (this.prediccion() ?? []).filter(
      (p): p is Prediccion & { ocupacion: number; disponibles: number } => p.ocupacion !== null,
    ),
  );

  protected readonly resumen = computed(() => {
    const lista = this.estimados();
    return {
      maxima: lista.length ? Math.max(...lista.map((p) => p.ocupacion)) : null,
      disponibles: lista.length ? Math.min(...lista.map((p) => p.disponibles)) : null,
      demanda: [...lista].sort((a, b) => b.ocupacion - a.ocupacion).slice(0, 3),
    };
  });
}
