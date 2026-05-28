package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "matricula")
public class Matricula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COLEGIO")
    private String colegio;

    @Column(name = "HOMBRES1")
    private String hombres1;

    @Column(name = "MUJERES1")
    private String mujeres1;

    @Column(name = "TOTAL_C")
    private String totalC;

    @Column(name = "HOMBRES2")
    private String hombres2;

    @Column(name = "MUJERES2")
    private String mujeres2;

    @Column(name = "TOTAL_E")
    private String totalE;

    @Column(name = "Matricula_CECyTE")
    private String matriculaCecyte;

    @Column(name = "Matricula_EMSAD")
    private String matriculaEmsad;

    @Column(name = "Total_Matricula1")
    private String totalMatricula1;

    @Column(name = "Semestre_1")
    private String semestre1;

    @Column(name = "Semestre_3")
    private String semestre3;

    @Column(name = "Semestre_5")
    private String semestre5;

    @Column(name = "Total_Matricula2")
    private String totalMatricula2;
}
