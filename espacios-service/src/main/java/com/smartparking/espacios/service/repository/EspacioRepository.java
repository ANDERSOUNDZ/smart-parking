package com.smartparking.espacios.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartparking.espacios.service.model.Espacio;

public interface EspacioRepository extends JpaRepository<Espacio, Integer> { }
