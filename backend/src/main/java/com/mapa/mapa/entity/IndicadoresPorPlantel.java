package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "indicadores_por_plantel")
public class IndicadoresPorPlantel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COLEGIO")
    private String colegio;

    @Column(name = "CCT")
    private String cct;

    @Column(name = "TIPO")
    private String tipo;

    @Column(name = "NOMBRE_DEL_PLANTEL")
    private String nombreDelPlantel;

    @Column(name = "EFICIENCIA_TERMINAL_2024_2025")
    private String eficienciaTerminal;

    @Column(name = "DESAFILIACION_ESCOLAR_2024_2025")
    private String desafiliacionEscolar;

    @Column(name = "REPROBACION_2024_2025")
    private String reprobacion;
}
