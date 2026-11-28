import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/api.service';
import { Captura, Filtro, HoraPico, Resumen, ResumenReservas } from '../../../core/models';
import {
  BASE,
  COLOR,
  HORIZONTAL,
  PORCENTAJE,
  agrupar,
  enVivo,
  fechaIso,
  grafica,
  haceDias,
  hora,
  serie,
} from '../reportes.utils';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.html',
})
export class Reportes {
  private readonly api = inject(ApiService);

  protected readonly base = BASE;
  protected readonly porcentaje = PORCENTAJE;
  protected readonly horizontal = HORIZONTAL;

  protected readonly desde = signal<Date | null>(haceDias(30));
  protected readonly hasta = signal<Date | null>(new Date());

  private readonly filtro = computed<Filtro>(() => ({
    desde: fechaIso(this.desde() ?? haceDias(30)),
    hasta: fechaIso(this.hasta() ?? new Date()),
  }));

  private readonly periodo = enVivo(toObservable(this.filtro), (f) =>
    forkJoin({
      resumen: this.api.analitica<Resumen>('resumen', { ...f }),
      historial: this.api.analitica<Captura[]>('historial', { ...f }),
      picos: this.api.analitica<HoraPico[]>('horas-pico', { ...f }),
      reservas: this.api.analitica<ResumenReservas>('reservas', { ...f }),
    }),
  );

  protected readonly sinServicio = computed(() => this.periodo() === null);
  protected readonly urlCsv = computed(
    () => `/api/analytics/exportar.csv?${new URLSearchParams({ ...this.filtro() })}`,
  );

  protected readonly indicadores = computed(() => {
    const r = this.periodo()?.resumen;
    const dato = (n: number | undefined) => (r?.registros ? n : null);
    return [
      { titulo: 'Registros analizados', valor: r?.registros },
      { titulo: 'Ocupación promedio', valor: dato(r?.promedio), sufijo: '%' },
      { titulo: 'Ocupación máxima', valor: dato(r?.maxima), sufijo: '%' },
      { titulo: 'Ocupación mínima', valor: dato(r?.minima), sufijo: '%' },
      { titulo: 'Hora de mayor ocupación', valor: r?.horaPico != null ? hora(r.horaPico) : null },
    ];
  });

  private readonly puntos = computed(() => agrupar(this.periodo()?.historial ?? []));

  protected readonly evolucion = computed(() =>
    grafica(
      this.puntos().map((p) => p.etiqueta),
      serie('Ocupación (%)', this.puntos().map((p) => p.porcentaje), COLOR.azul),
    ),
  );

  protected readonly espacios = computed(() =>
    grafica(
      this.puntos().map((p) => p.etiqueta),
      serie('Ocupados', this.puntos().map((p) => p.ocupados), COLOR.rojo),
      serie('Disponibles', this.puntos().map((p) => p.disponibles), COLOR.verde),
    ),
  );

  protected readonly horasPico = computed(() => {
    const picos = (this.periodo()?.picos ?? []).slice(0, 5);
    return grafica(
      picos.map((p) => hora(p.hora)),
      serie('Ocupación promedio (%)', picos.map((p) => p.promedio), COLOR.azul),
    );
  });

  protected readonly reservasPorHora = computed(() => {
    const lista = this.periodo()?.reservas.porHora ?? [];
    return grafica(
      lista.map((r) => hora(r.hora)),
      serie('Reservas creadas', lista.map((r) => r.cantidad), COLOR.azul),
    );
  });

  protected readonly resumenReservas = computed(() => {
    const r = this.periodo()?.reservas;
    return r
      ? `${r.total} en total · ${r.confirmadas} confirmadas · ${r.canceladas} canceladas · ${r.tasaCancelacion}% de cancelación`
      : 'Sin datos';
  });

  protected imprimir() {
    window.print();
  }
}
