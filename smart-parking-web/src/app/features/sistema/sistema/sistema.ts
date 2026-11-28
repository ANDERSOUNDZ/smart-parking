import { Component } from '@angular/core';

@Component({
  selector: 'app-sistema',
  standalone: false,
  templateUrl: './sistema.html',
  styleUrl: './sistema.scss',
})
export class Sistema {
  protected readonly menu = [
    { ruta: 'panel', texto: 'Panel' },
    { ruta: 'espacios', texto: 'Espacios' },
  ];
}
