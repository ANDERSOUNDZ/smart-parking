package com.smartparking.analytics.service.model;

import java.time.LocalDateTime;
import java.util.List;

public final class Reportes {

    private Reportes() {
    }

    public record Resumen(int registros, double promedio, double maxima,
            double minima, Integer horaPico) {
    }

    public record HoraPico(int hora, double promedio, int muestras) {
    }

    public record Mes(String mes, double promedio, int registros) {
    }

    public record Comparacion(Mes anterior, Mes seleccionado, Double variacion) {
    }

    public record Prediccion(LocalDateTime fechaHora, Double ocupacion, Integer disponibles, int muestras) {
    }

    public record ReservasPorHora(int hora, long cantidad) {
    }

    public record ResumenReservas(int total, long confirmadas, long canceladas, double tasaCancelacion,
            List<ReservasPorHora> porHora) {
    }

    public record EspacioDTO(int id, boolean ocupado) {
    }

    public record ReservaDTO(Long id, int idEspacio, LocalDateTime fechaReserva, String estado) {
    }
}
