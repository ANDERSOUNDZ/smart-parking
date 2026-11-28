import { Component, input } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BASE } from '../reportes.utils';

@Component({
  selector: 'app-grafica',
  standalone: false,
  templateUrl: './grafica.html',
  styleUrl: './grafica.scss',
})
export class Grafica {
  readonly titulo = input.required<string>();
  readonly subtitulo = input('');
  readonly tipo = input<ChartType>('bar');
  readonly datos = input.required<ChartData>();
  readonly opciones = input<ChartOptions>(BASE);
}
