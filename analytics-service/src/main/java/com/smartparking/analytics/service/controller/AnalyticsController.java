package com.smartparking.analytics.service.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.smartparking.analytics.service.model.Captura;
import com.smartparking.analytics.service.model.Reportes.Comparacion;
import com.smartparking.analytics.service.model.Reportes.HoraPico;
import com.smartparking.analytics.service.model.Reportes.Prediccion;
import com.smartparking.analytics.service.model.Reportes.Resumen;
import com.smartparking.analytics.service.model.Reportes.ResumenReservas;
import com.smartparking.analytics.service.service.CapturaService;
import com.smartparking.analytics.service.service.ReporteService;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final CapturaService capturaService;
    private final ReporteService reporteService;

    public AnalyticsController(CapturaService capturaService, ReporteService reporteService) {
        this.capturaService = capturaService;
        this.reporteService = reporteService;
    }

    @PostMapping("/captura")
    public ResponseEntity<Captura> capturar() {
        return ResponseEntity.status(HttpStatus.CREATED).body(capturaService.capturar());
    }

    @GetMapping("/historial")
    public List<Captura> historial(
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return reporteService.historial(desde, hasta);
    }

    @GetMapping("/resumen")
    public Resumen resumen(
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return reporteService.resumen(desde, hasta);
    }

    @GetMapping("/horas-pico")
    public List<HoraPico> horasPico(
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return reporteService.horasPico(desde, hasta);
    }

    @GetMapping("/comparacion")
    public Comparacion comparacion(
            @RequestParam String mes) {
        try {
            return reporteService.comparacion(YearMonth.parse(mes));
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'mes' debe tener el formato AAAA-MM");
        }
    }

    @GetMapping("/prediccion")
    public List<Prediccion> prediccion(
            @RequestParam(defaultValue = "6") int horas) {
        return reporteService.prediccion(horas);
    }

    @GetMapping("/reservas")
    public ResumenReservas reservas(
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        return reporteService.reservas(desde, hasta);
    }

    @GetMapping(value = "/exportar.csv", produces = "text/csv;charset=UTF-8")
    public ResponseEntity<String> exportar(
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate hasta) {
        StringBuilder csv = new StringBuilder("﻿FechaHora;Total;Ocupados;Disponibles;Porcentaje\r\n");
        for (Captura c : reporteService.historial(desde, hasta)) {
            csv.append(c.getFechaHora().withNano(0).toString().replace('T', ' ')).append(';')
                    .append(c.getTotal()).append(';')
                    .append(c.getOcupados()).append(';')
                    .append(c.getDisponibles()).append(';')
                    .append(String.valueOf(c.getPorcentaje()).replace('.', ',')).append("\r\n");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ocupacion.csv")
                .body(csv.toString());
    }

}
