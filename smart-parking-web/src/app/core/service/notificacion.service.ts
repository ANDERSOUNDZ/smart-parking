import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly snackBar = inject(MatSnackBar);

  mostrar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3500 });
  }

  /** El backend no envia el detalle del error, asi que se traduce por codigo HTTP. */
  error(error: HttpErrorResponse, mensajes: Record<number, string> = {}) {
    this.mostrar(mensajes[error.status] ?? `No se pudo completar la operación (error ${error.status}).`);
  }
}
