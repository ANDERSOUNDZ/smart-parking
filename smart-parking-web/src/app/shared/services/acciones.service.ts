import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable, catchError, filter, switchMap, tap } from 'rxjs';
import { DatosService } from '../../core/datos.service';
import { DatosDialogo, Dialogo } from '../components/dialogo/dialogo';

@Injectable({ providedIn: 'root' })
export class AccionesService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly datos = inject(DatosService);

  ejecutar(
    dialogo: DatosDialogo,
    accion: (respuesta: number) => Observable<unknown>,
    exito: string,
    errores: Record<number, string> = {},
  ) {
    this.dialog
      .open(Dialogo, { data: dialogo })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((respuesta: number) =>
          accion(respuesta).pipe(
            tap(() => this.avisar(exito)),
            catchError((e: HttpErrorResponse) => {
              this.avisar(errores[e.status] ?? `No se pudo completar la operación (error ${e.status}).`);
              this.datos.refrescar();
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe(() => this.datos.refrescar());
  }

  private avisar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3500 });
  }
}
