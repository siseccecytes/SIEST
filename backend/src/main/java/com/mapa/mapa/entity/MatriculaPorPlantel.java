package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "matricula_por_plantel")
public class MatriculaPorPlantel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COLEGIO")
    private String colegio;

    @Column(name = "TIPO")
    private String tipo;

    @Column(name = "CCT")
    private String cct;

    @Column(name = "PLANTEL")
    private String plantel;

    @Column(name = "Clave_Carrera")
    private String claveCarrera;

    @Column(name = "CARRERA")
    private String carrera;

    @Column(name = "TURNO")
    private String turno;

    @Column(name = "GENERO")
    private String genero;

    @Column(name = "Grupos_1ero")
    private String grupos1ero;

    @Column(name = "Alumnos_1ero")
    private String alumnos1ero;

    @Column(name = "Grupos_3ero")
    private String grupos3ero;

    @Column(name = "Alumnos_3ero")
    private String alumnos3ero;

    @Column(name = "Grupos_5to")
    private String grupos5to;

    @Column(name = "Alumnos_5to")
    private String alumnos5to;

    @Column(name = "total_grupos")
    private String totalGrupos;

    @Column(name = "Total_alumnos")
    private String totalAlumnos;
}
