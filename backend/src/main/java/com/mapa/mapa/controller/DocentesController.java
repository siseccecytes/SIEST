package com.mapa.mapa.controller;

import com.mapa.mapa.entity.DocentesPorEstado;
import com.mapa.mapa.entity.DocentesPorPlantel;
import com.mapa.mapa.repository.DocentesPorEstadoRepository;
import com.mapa.mapa.repository.DocentesPorPlantelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocentesController {

    private final DocentesPorEstadoRepository docentesPorEstadoRepository;
    private final DocentesPorPlantelRepository docentesPorPlantelRepository;

    @GetMapping("/por-estado")
    @Cacheable("docentes-por-estado")
    public ResponseEntity<List<DocentesPorEstado>> getPorEstado() {
        return ResponseEntity.ok(docentesPorEstadoRepository.findAll());
    }

    @GetMapping("/por-plantel")
    @Cacheable(value = "docentes-por-plantel", key = "#colegio ?: 'todos'")
    public ResponseEntity<List<DocentesPorPlantel>> getPorPlantel(
            @RequestParam(required = false) String colegio) {
        if (colegio != null && !colegio.isBlank()) {
            return ResponseEntity.ok(docentesPorPlantelRepository.findByColegioIgnoreCase(colegio));
        }
        return ResponseEntity.ok(docentesPorPlantelRepository.findAll());
    }
}
