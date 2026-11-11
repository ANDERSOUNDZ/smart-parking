package com.smartparking.reservas.service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import com.smartparking.reservas.service.model.EspacioDTO;
import com.smartparking.reservas.service.model.Reserva;
import com.smartparking.reservas.service.repository.ReservaRepository;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final RestTemplate restTemplate;

    public ReservaService(
            ReservaRepository reservaRepository,
            RestTemplate restTemplate) {
        this.reservaRepository = reservaRepository;
        this.restTemplate = restTemplate;
    }

    public List<Reserva> obtenerTodas() {
        return reservaRepository.findAll();
    }

    public String consultarEspacios() {
        return restTemplate.getForObject(
                "http://espacios-service/espacios",
                String.class);
    }

    public Reserva obtenerPorId(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"));
    }

    @Transactional
    public Reserva crearReserva(int idEspacio) {

        String url =
                "http://espacios-service/espacios/" + idEspacio;

        EspacioDTO espacio;

        try {
            espacio = restTemplate.getForObject(
                    url, EspacioDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El espacio no existe");
        }

        if (espacio == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El espacio no existe");
        }

        if (espacio.isOcupado()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El espacio ya está ocupado");
        }

        espacio.setOcupado(true);

        try {
            restTemplate.put(url, espacio);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "No fue posible actualizar el espacio");
        }

        Reserva reserva = new Reserva();
        reserva.setIdEspacio(idEspacio);
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setEstado("CONFIRMADA");

        return reservaRepository.save(reserva);
    }
}