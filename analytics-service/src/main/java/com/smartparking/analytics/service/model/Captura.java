package com.smartparking.analytics.service.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Captura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaHora;
    private int total;
    private int ocupados;
    private int disponibles;
    private double porcentaje;

    public Captura() {
    }

    public Captura(LocalDateTime fechaHora, int total, int ocupados) {
        this.fechaHora = fechaHora;
        this.total = total;
        this.ocupados = ocupados;
        this.disponibles = total - ocupados;
        this.porcentaje = total == 0 ? 0 : Math.round(ocupados * 10000.0 / total) / 100.0;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public int getTotal() {
        return total;
    }

    public int getOcupados() {
        return ocupados;
    }

    public int getDisponibles() {
        return disponibles;
    }

    public double getPorcentaje() {
        return porcentaje;
    }
}
