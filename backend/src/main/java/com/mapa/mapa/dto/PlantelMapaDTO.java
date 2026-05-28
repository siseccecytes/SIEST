package com.mapa.mapa.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlantelMapaDTO {
    private Long id;
    private String colegio;
    private String cct;
    private String tipo;
    private String nombreDelPlantel;
    private Double eficienciaTerminal;
    private Double desafiliacionEscolar;
    private Double reprobacion;
    private Integer matricula;
    private Double latitud;
    private Double longitud;
    private String direccion;
}
