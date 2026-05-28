package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "info_federal")
public class InfoFederal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String indicador;
    
    @Column(name = "aprobacion_2024_2025")
    private Double aprobacion;
    
    @Column(name = "desafiliacion_2024_2025")
    private Double desafiliacion;
    
    @Column(name = "eficiencia_terminal_2024_2025")
    private Double eficienciaTerminal;
    
    @Column(name = "docentes_2025_2026")
    private String docentes;
    
    private Integer matricula;
    private String carreras;
    private String titular;
}
