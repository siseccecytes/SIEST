package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "indicadores")
public class Indicadores {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COLEGIO")
    private String colegio;

    @Column(name = "EFICIENCIA_TERMINA")
    private String eficienciaTerminal;

    @Column(name = "APROBACION")
    private String aprobacion;

    @Column(name = "DESERCION")
    private String desercion;
}
