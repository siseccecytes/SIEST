package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "oferta_educativa_estado")
public class OfertaEducativaEstado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COLEGIO")
    private String colegio;

    @Column(name = "PLANTEL")
    private String plantel;

    @Column(name = "CCT")
    private String cct;

    @Column(name = "CARRERA_DUALES")
    private String carreraDuales;

    @Column(name = "CARRERA")
    private String carrera;

    @Column(name = "CLAVE")
    private String clave;

    @Column(name = "GENERACION")
    private String generacion;

    @Column(name = "MOVIMIENTOS")
    private String movimientos;

    @Column(name = "MODALIDAD")
    private String modalidad;
}
