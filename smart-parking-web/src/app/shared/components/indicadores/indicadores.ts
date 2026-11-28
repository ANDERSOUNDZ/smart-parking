import { Component, input } from '@angular/core';
import { pantallaCompacta } from '../../pantalla-compacta';

export interface Indicador {
  titulo: string;
  valor: string | number | null | undefined;
  sufijo?: string;
}

@Component({
  selector: 'app-indicadores',
  standalone: false,
  templateUrl: './indicadores.html',
})
export class Indicadores {
  readonly items = input.required<Indicador[]>();
  readonly alto = input('100px');
  protected readonly compacto = pantallaCompacta();
}
