package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "docentes_por_plantel")
public class DocentesPorPlantel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COLEGIO")
    private String colegio;

    @Column(name = "CCT")
    private String cct;

    @Column(name = "PLANTEL")
    private String plantel;

    @Column(name = "NOMBRE_DEL_DOCENTE")
    private String nombreDelDocente;

    @Column(name = "CLAVE_CARRERA")
    private String claveCarrera;

    @Column(name = "CARRERA")
    private String carrera;

    @Column(name = "HORAS_ASIGNADAS")
    private Integer horasAsignadas;
}
