package com.mapa.mapa.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    private String nombre;

    @Column(nullable = false, length = 50)
    private String rol;

    private boolean activo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
