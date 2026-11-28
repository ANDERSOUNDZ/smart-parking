import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DatosDialogo {
  titulo: string;
  mensaje: string;
  numero?: number;
}

@Component({
  selector: 'app-dialogo',
  standalone: false,
  templateUrl: './dialogo.html',
})
export class Dialogo {
  protected readonly datos = inject<DatosDialogo>(MAT_DIALOG_DATA);
  protected readonly pideNumero = this.datos.numero !== undefined;
  protected numero: number | null = this.datos.numero ?? null;

  protected valido() {
    return !this.pideNumero || (this.numero !== null && Number.isInteger(this.numero) && this.numero > 0);
  }
}
