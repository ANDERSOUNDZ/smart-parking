export interface Reserva {
  id: number;
  idEspacio: number;
  fechaReserva: string;
  estado: 'CONFIRMADA' | 'CANCELADA';
}
