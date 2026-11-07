package com.smartparking.espacios.service.controller;
import com.smartparking.espacios.service.service.EspacioService;
import com.smartparking.espacios.service.model.Espacio;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class EspacioController {

    private final EspacioService espacioService;

    public EspacioController(EspacioService espacioService) {
        this.espacioService = espacioService;
    }

    @GetMapping("/espacios")
    public List<Espacio> obtenerEspacios() {
        return espacioService.obtenerTodos();
    }

    @GetMapping("/espacios/{id}")
    public ResponseEntity<Espacio> obtenerEspacioPorId(
            @PathVariable int id) {

        Espacio espacio = espacioService.obtenerPorId(id);

        if (espacio == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(espacio);
    }

    @PostMapping("/espacios")
    public ResponseEntity<Espacio> crearEspacio(
            @RequestBody Espacio nuevoEspacio) {

        boolean creado = espacioService.crear(nuevoEspacio);

        if (!creado) {
            return ResponseEntity.status(
                HttpStatus.CONFLICT
            ).build();
        }

        return ResponseEntity.status(
            HttpStatus.CREATED
        ).body(nuevoEspacio);
    }

    @PutMapping("/espacios/{id}")
    public ResponseEntity<Espacio> actualizarEspacio(
            @PathVariable int id,
            @RequestBody Espacio datosActualizados) {

        if (datosActualizados.getId() != id) {
            return ResponseEntity.badRequest().build();
        }

        Espacio actualizado = espacioService.actualizar(
            id, datosActualizados
        );

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/espacios/{id}")
    public ResponseEntity<Void> eliminarEspacio(
            @PathVariable int id) {

        boolean eliminado = espacioService.eliminar(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}