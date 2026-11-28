import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sinDato', standalone: false })
export class SinDatoPipe implements PipeTransform {
  transform(valor: string | number | null | undefined, sufijo = '') {
    return valor === null || valor === undefined ? '—' : `${valor}${sufijo}`;
  }
}
