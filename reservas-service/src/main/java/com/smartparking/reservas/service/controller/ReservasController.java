package com.smartparking.reservas.service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartparking.reservas.service.model.Reserva;
import com.smartparking.reservas.service.service.ReservaService;

@RestController
public class ReservasController {

    private final ReservaService reservaService;

    public ReservasController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping("/reservas")
    public List<Reserva> obtenerReservas() {
        return reservaService.obtenerTodas();
    }

    @GetMapping("/reservas/espacios")
    public String consultarEspacios() {
        return reservaService.consultarEspacios();
    }
    
    @GetMapping("/reservas/{id}")
    public Reserva obtenerReserva(@PathVariable Long id) {
        return reservaService.obtenerPorId(id);
    }

    @PostMapping("/reservas/{idEspacio}")
    public ResponseEntity<Reserva> crearReserva(
            @PathVariable int idEspacio) {

        Reserva reserva = reservaService.crearReserva(idEspacio);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reserva);
    }
}
