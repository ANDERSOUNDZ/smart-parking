export interface Espacio {
  id: number;
  ocupado: boolean;
}

export interface Reserva {
  id: number;
  idEspacio: number;
  fechaReserva: string;
  estado: 'CONFIRMADA' | 'CANCELADA';
}

export interface Filtro {
  desde: string;
  hasta: string;
}

export interface Captura {
  fechaHora: string;
  ocupados: number;
  disponibles: number;
  porcentaje: number;
}

export interface Resumen {
  registros: number;
  promedio: number;
  maxima: number;
  minima: number;
  horaPico: number | null;
}

export interface HoraPico {
  hora: number;
  promedio: number;
}

export interface Comparacion {
  anterior: { mes: string; promedio: number; registros: number };
  seleccionado: { mes: string; promedio: number; registros: number };
  variacion: number | null;
}

export interface Prediccion {
  fechaHora: string;
  ocupacion: number | null;
  disponibles: number | null;
}

export interface ResumenReservas {
  total: number;
  confirmadas: number;
  canceladas: number;
  tasaCancelacion: number;
  porHora: { hora: number; cantidad: number }[];
}
