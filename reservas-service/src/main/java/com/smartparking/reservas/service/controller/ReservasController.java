package com.smartparking.reservas.service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.smartparking.reservas.service.model.EspacioDTO;

@RestController
public class ReservasController {

    private final RestTemplate restTemplate;

    public ReservasController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/reservas/espacios")
    public String consultarEspacios() {
        return restTemplate.getForObject(
                "http://espacios-service/espacios",
                String.class
        );
    }

    @PostMapping("/reservas/{idEspacio}")
    public ResponseEntity<?> reservarEspacio(
            @PathVariable int idEspacio) {

        String url =
                "http://espacios-service/espacios/" + idEspacio;

        EspacioDTO espacio;

        try {
            espacio = restTemplate.getForObject(
                    url, EspacioDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.notFound().build();
        }

        if (espacio == null) {
            return ResponseEntity.notFound().build();
        }

        if (espacio.isOcupado()) {
            return ResponseEntity.status(
                    HttpStatus.CONFLICT
            ).body("El espacio ya está ocupado.");
        }

        espacio.setOcupado(true);

        restTemplate.put(url, espacio);

        return ResponseEntity.status(
                HttpStatus.CREATED
        ).body(espacio);
    }
}
