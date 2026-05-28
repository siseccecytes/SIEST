package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "planteles")
public class Plantel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String colegio;
    private String cct;
    private String tipo;
    
    @Column(name = "nombre_del_plantel")
    private String nombreDelPlantel;
    
    @Column(name = "eficiencia_terminal_2024_2025")
    private Double eficienciaTerminal;
    
    @Column(name = "desafiliacion_escolar_2024_2025")
    private Double desafiliacionEscolar;
    
    @Column(name = "reprobacion_2024_2025")
    private Double reprobacion;
    
    @Column(name = "matricula_2025_2026")
    private Integer matricula;
}
