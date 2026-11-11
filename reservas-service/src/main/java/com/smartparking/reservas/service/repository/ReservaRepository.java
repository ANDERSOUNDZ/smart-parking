package com.smartparking.reservas.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartparking.reservas.service.model.Reserva;

public interface ReservaRepository
        extends JpaRepository<Reserva, Long> {
}