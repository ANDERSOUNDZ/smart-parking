import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Espacio, Reserva } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  espacios() {
    return this.http.get<Espacio[]>('/api/espacios');
  }

  crearEspacio(espacio: Espacio) {
    return this.http.post<Espacio>('/api/espacios', espacio);
  }

  actualizarEspacio(espacio: Espacio) {
    return this.http.put<Espacio>(`/api/espacios/${espacio.id}`, espacio);
  }

  eliminarEspacio(id: number) {
    return this.http.delete<void>(`/api/espacios/${id}`);
  }

  reservas() {
    return this.http.get<Reserva[]>('/api/reservas');
  }

  reservar(idEspacio: number) {
    return this.http.post<Reserva>(`/api/reservas/${idEspacio}`, null);
  }

  cancelar(id: number) {
    return this.http.delete<Reserva>(`/api/reservas/${id}`);
  }

  analitica<T>(ruta: string, params: Record<string, string | number | boolean>) {
    return this.http.get<T>(`/api/analytics/${ruta}`, { params });
  }
}
