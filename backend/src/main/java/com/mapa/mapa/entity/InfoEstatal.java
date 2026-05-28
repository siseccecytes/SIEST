package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "info_estatal")
public class InfoEstatal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "Colegio")
    private String colegio;
    
    @Column(name = "Matricula_2025-2026")
    private String matricula;
    
    @Column(name = "eficiencia_terminal_2024_2025")
    private String eficienciaTerminal;
    
    @Column(name = "Desafiliacion_escolar_2024_2025")
    private String desafiliacionEscolar;
    
    @Column(name = "Aprobacion_2024_2025")
    private String aprobacion;
    
    @Column(name = "Presupuesto")
    private String presupuesto;
    
    @Column(name = "Docentes_a")
    private String docentesA;
    
    @Column(name = "Docentes_b")
    private String docentesB;
    
    @Column(name = "Aulas")
    private String aulas;
    
    @Column(name = "Direccion")
    private String direccion;
    
    @Column(name = "latitud")
    private String latitud;
    
    @Column(name = "longitud")
    private String longitud;
    
    @Column(name = "Titular")
    private String titular;
}
