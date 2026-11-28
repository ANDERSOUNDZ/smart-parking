import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Espacio } from '../model/espacio';

@Injectable({ providedIn: 'root' })
export class EspaciosService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/espacios';

  listar() {
    return this.http.get<Espacio[]>(this.url);
  }

  crear(espacio: Espacio) {
    return this.http.post<Espacio>(this.url, espacio);
  }

  actualizar(espacio: Espacio) {
    return this.http.put<Espacio>(`${this.url}/${espacio.id}`, espacio);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
