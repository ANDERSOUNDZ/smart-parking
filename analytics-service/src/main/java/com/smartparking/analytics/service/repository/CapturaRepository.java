package com.smartparking.analytics.service.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartparking.analytics.service.model.Captura;

public interface CapturaRepository extends JpaRepository<Captura, Long> {

    List<Captura> findByFechaHoraBetweenOrderByFechaHora(LocalDateTime desde, LocalDateTime hasta);
}
