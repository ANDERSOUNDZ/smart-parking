package com.smartparking.reservas.service.model;

public class EspacioDTO {
    private int id;
    private boolean ocupado;

    public EspacioDTO() {
    }

    public EspacioDTO(int id, boolean ocupado) {
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
