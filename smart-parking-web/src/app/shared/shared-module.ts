import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BotonEspacio } from './boton-espacio';
import { ConfirmarDialog } from './confirmar-dialog';

const MODULOS = [
  CommonModule, FormsModule, MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule,
  MatGridListModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule,
  MatTableModule, MatTooltipModule,
];

function paginadorEnEspanol() {
  const textos = new MatPaginatorIntl();
  textos.itemsPerPageLabel = 'Filas por página';
  textos.nextPageLabel = 'Siguiente';
  textos.previousPageLabel = 'Anterior';
  textos.getRangeLabel = (pagina, tamano, total) =>
    total ? `${pagina * tamano + 1} – ${Math.min((pagina + 1) * tamano, total)} de ${total}` : '0 de 0';
  return textos;
}

@NgModule({
  declarations: [BotonEspacio, ConfirmarDialog],
  imports: MODULOS,
  exports: [...MODULOS, BotonEspacio, ConfirmarDialog],
  providers: [{ provide: MatPaginatorIntl, useFactory: paginadorEnEspanol }],
})
export class SharedModule {}
