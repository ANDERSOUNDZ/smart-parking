import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Confirmar</h2>
    <mat-dialog-content>{{ mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Cancelar</button>
      <button matButton="filled" [mat-dialog-close]="true">Aceptar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmarDialog {
  protected readonly mensaje = inject<string>(MAT_DIALOG_DATA);
}
