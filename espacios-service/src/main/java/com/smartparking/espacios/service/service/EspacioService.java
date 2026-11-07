package com.smartparking.espacios.service.service;

import  com.smartparking.espacios.service.model.Espacio;
import com.smartparking.espacios.service.repository.EspacioRepository;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class EspacioService {

    private final EspacioRepository espacioRepository;

    public EspacioService(EspacioRepository espacioRepository) {
        this.espacioRepository = espacioRepository;
    }

    public List<Espacio> obtenerTodos() {
        return espacioRepository.findAll();
    }

    public Espacio obtenerPorId(int id) {
        return espacioRepository.findById(id).orElse(null);
    }

    public boolean crear(Espacio nuevoEspacio) {

        if (espacioRepository.existsById(nuevoEspacio.getId())) {
            return false;
        }

        espacioRepository.save(nuevoEspacio);

        return true;
    }

    @Transactional 
    public Espacio actualizar(int id, Espacio datosActualizados) {

        Espacio espacio = obtenerPorId(id);

        if (espacio == null) {
            return null;
        }

        espacio.setOcupado(datosActualizados.isOcupado());

        return espacioRepository.save(espacio);
    }

    @Transactional
    public boolean eliminar(int id) {

        if (!espacioRepository.existsById(id)) {
            return false;
        }

        espacioRepository.deleteById(id);

        return true;
    }
}
