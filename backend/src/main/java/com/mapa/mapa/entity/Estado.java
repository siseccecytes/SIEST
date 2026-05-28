package com.mapa.mapa.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Estado {
    private String nombre;
    private Double latitud;
    private Double longitud;
}
