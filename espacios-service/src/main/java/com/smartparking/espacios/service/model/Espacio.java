package com.smartparking.espacios.service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
@Table(name = "ESPACIOS")
public class Espacio {

    @Id
    @Column(name = "ID")
    private Integer id;

    @Column(name = "OCUPADO")
    private boolean ocupado;

    public Espacio() {
    }

    public Espacio(int id, boolean ocupado) {
        this.id = id;
        this.ocupado = ocupado;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isOcupado() {
        return ocupado;
    }

    public void setOcupado(boolean ocupado) {
        this.ocupado = ocupado;
    }
}
