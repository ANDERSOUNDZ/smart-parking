package com.smartparking.reservas.service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

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
}
