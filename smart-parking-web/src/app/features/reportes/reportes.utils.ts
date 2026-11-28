import { toSignal } from '@angular/core/rxjs-interop';
import { ChartData, ChartOptions } from 'chart.js';
import { Observable, catchError, of, switchMap, timer } from 'rxjs';
import { Captura } from '../../core/models';

export const COLOR = { azul: '#005cbb', rojo: '#ba1a1a', verde: '#026e00' };

export const BASE: ChartOptions = { responsive: true, maintainAspectRatio: false, animation: false };
export const PORCENTAJE: ChartOptions = { ...BASE, scales: { y: { min: 0, max: 100 } } };
export const HORIZONTAL: ChartOptions = { ...BASE, indexAxis: 'y', scales: { x: { min: 0, max: 100 } } };

export const serie = (label: string, data: (number | null)[], color: string) => ({
  label,
  data,
  borderColor: color,
  backgroundColor: color,
  pointRadius: 2,
});

export const grafica = (labels: string[], ...datasets: ReturnType<typeof serie>[]): ChartData => ({
  labels,
  datasets,
});

export const hora = (valor: number) => `${String(valor).padStart(2, '0')}:00`;

export const fechaIso = (fecha: Date) => fecha.toLocaleDateString('sv-SE');

export function haceDias(dias: number) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}

export function agrupar(capturas: Captura[]) {
  const porDia = new Set(capturas.map((c) => c.fechaHora.slice(0, 10))).size > 2;
  const grupos = new Map<string, Captura[]>();
  for (const c of capturas) {
    const clave = porDia ? c.fechaHora.slice(0, 10) : c.fechaHora.slice(5, 16).replace('T', ' ');
    grupos.set(clave, [...(grupos.get(clave) ?? []), c]);
  }
  const promedio = (lista: Captura[], campo: 'porcentaje' | 'ocupados' | 'disponibles') =>
    Math.round((lista.reduce((suma, c) => suma + c[campo], 0) / lista.length) * 100) / 100;
  return [...grupos].map(([etiqueta, lista]) => ({
    etiqueta,
    porcentaje: promedio(lista, 'porcentaje'),
    ocupados: promedio(lista, 'ocupados'),
    disponibles: promedio(lista, 'disponibles'),
  }));
}

export function enVivo<P, T>(parametros: Observable<P>, consulta: (p: P) => Observable<T>) {
  return toSignal(
    parametros.pipe(
      switchMap((p) => timer(0, 15000).pipe(switchMap(() => consulta(p).pipe(catchError(() => of(null)))))),
    ),
  );
}
