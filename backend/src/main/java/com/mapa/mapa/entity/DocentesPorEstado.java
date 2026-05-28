package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "docentes_por_estado")
public class DocentesPorEstado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Estado")
    private String estado;

    @Column(name = "Total_de_planteles_con_captura")
    private String totalPlantelesConCaptura;

    @Column(name = "Total_de_docentes")
    private String totalDocentes;

    @Column(name = "Total_de_docentes_Hombres")
    private String totalDocentesHombres;

    @Column(name = "Total_de_docentes_Mujeres")
    private String totalDocentesMujeres;

    @Column(name = "Total_de_horas")
    private String totalHoras;

    @Column(name = "Total_de_horas_Hombres")
    private String totalHorasHombres;

    @Column(name = "Total_de_horas_Mujeres")
    private String totalHorasMujeres;
}
