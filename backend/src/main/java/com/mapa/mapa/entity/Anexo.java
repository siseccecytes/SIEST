package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "anexos")
public class Anexo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Colegios")
    private String colegios;

    @Column(name = "ANEXOS_2024")
    private String anexos2024;
}
