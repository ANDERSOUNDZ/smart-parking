package com.smartparking.analytics.service.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.smartparking.analytics.service.model.Captura;
import com.smartparking.analytics.service.model.Reportes.EspacioDTO;
import com.smartparking.analytics.service.repository.CapturaRepository;

@Service
public class CapturaService {

    private static final Logger log = LoggerFactory.getLogger(CapturaService.class);

    private final CapturaRepository repository;
    private final RestTemplate restTemplate;

    public CapturaService(CapturaRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public Captura capturar() {
        EspacioDTO[] espacios = espacios();
        int ocupados = 0;
        for (EspacioDTO espacio : espacios) {
            if (espacio.ocupado()) {
                ocupados++;
            }
        }
        return repository.save(new Captura(LocalDateTime.now(), espacios.length, ocupados));
    }

    @Scheduled(initialDelay = 40000, fixedRateString = "${analytics.captura.intervalo-ms}")
    public void capturaProgramada() {
        try {
            capturar();
        } catch (RuntimeException e) {
            log.warn("No se pudo tomar la foto de ocupacion: {}", e.getMessage());
        }
    }

    private EspacioDTO[] espacios() {
        EspacioDTO[] espacios = restTemplate.getForObject(
                "http://espacios-service/espacios", EspacioDTO[].class);
        if (espacios == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "espacios-service no respondio");
        }
        return espacios;
    }
}
