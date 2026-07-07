package com.mapa.mapa.controller;

import com.mapa.mapa.entity.Indicadores;
import com.mapa.mapa.entity.IndicadoresPorPlantel;
import com.mapa.mapa.repository.IndicadoresRepository;
import com.mapa.mapa.repository.IndicadoresPorPlantelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/indicadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IndicadoresController {

    private final IndicadoresRepository indicadoresRepository;
    private final IndicadoresPorPlantelRepository indicadoresPorPlantelRepository;

    @GetMapping("/nacionales")
    @Cacheable("indicadores-nacionales")
    public ResponseEntity<List<Indicadores>> getNacionales() {
        return ResponseEntity.ok(indicadoresRepository.findAll());
    }

    @GetMapping("/por-plantel")
    @Cacheable(value = "indicadores-por-plantel", key = "#colegio ?: 'todos'")
    public ResponseEntity<List<IndicadoresPorPlantel>> getPorPlantel(
            @RequestParam(required = false) String colegio) {
        if (colegio != null && !colegio.isBlank()) {
            return ResponseEntity.ok(indicadoresPorPlantelRepository.findByColegioIgnoreCase(colegio));
        }
        return ResponseEntity.ok(indicadoresPorPlantelRepository.findAll());
    }
}
