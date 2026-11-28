import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Reserva } from '../model/reserva';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/reservas';

  listar() {
    return this.http.get<Reserva[]>(this.url);
  }

  crear(idEspacio: number) {
    return this.http.post<Reserva>(`${this.url}/${idEspacio}`, null);
  }

  cancelar(id: number) {
    return this.http.delete<Reserva>(`${this.url}/${id}`);
  }
}
