import { Component } from '@angular/core';

@Component({
  selector: 'app-sistema-layout',
  standalone: false,
  templateUrl: './sistema-layout.html',
  styles: `
    mat-sidenav-container { flex: 1; }
    mat-sidenav { width: 200px; }
  `,
})
export class SistemaLayout {
  protected readonly menu = [
    { ruta: 'panel', texto: 'Panel' },
    { ruta: 'espacios', texto: 'Espacios' },
  ];
}
