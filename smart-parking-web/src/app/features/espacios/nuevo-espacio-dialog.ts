import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nuevo-espacio-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Nuevo espacio</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>ID del espacio</mat-label>
        <input matInput type="number" min="1" step="1" required [(ngModel)]="id" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Cancelar</button>
      <button matButton="filled" [mat-dialog-close]="id" [disabled]="!valido()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class NuevoEspacioDialog {
  /** Se sugiere el siguiente ID libre. */
  protected id: number | null = inject<number>(MAT_DIALOG_DATA);

  protected valido() {
    return this.id !== null && Number.isInteger(this.id) && this.id > 0;
  }
}
