package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "oferta_educativa_nacional")
public class OfertaEducativaNacional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "CARRERAS")
    private String carreras;

    @Column(name = "MODALIDAD_PRESENCIAL")
    private String modalidadPresencial;

    @Column(name = "MODALIDAD_DUAL")
    private String modalidadDual;

    @Column(name = "MODALIDAD_MIXTA")
    private String modalidadMixta;

    @Column(name = "COMUN_ESPECIFICA")
    private String comunEspecifica;
}
