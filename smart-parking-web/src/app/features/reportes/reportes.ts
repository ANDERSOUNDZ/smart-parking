import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  standalone: false,
  template: `
    <div class="pagina">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Reportes</mat-card-title>
          <mat-card-subtitle>Disponible en la siguiente etapa</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Aquí se mostrarán el historial de ocupación, las horas pico, la comparación mensual y la predicción
             cuando exista el servicio de analítica.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class Reportes {}
