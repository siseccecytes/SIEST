package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "directorio_emsad")
public class DirectorioEmsad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String colegio;
    private String cct;
    private String direccion;
    
    private Double latitud;
    private Double longitud;
}
