package com.mapa.mapa.controller;

import com.mapa.mapa.entity.Matricula;
import com.mapa.mapa.entity.Matricula20252026;
import com.mapa.mapa.entity.MatriculaPorPlantel;
import com.mapa.mapa.repository.MatriculaRepository;
import com.mapa.mapa.repository.Matricula20252026Repository;
import com.mapa.mapa.repository.MatriculaPorPlantelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matricula")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;
    private final Matricula20252026Repository matricula20252026Repository;
    private final MatriculaPorPlantelRepository matriculaPorPlantelRepository;

    @GetMapping("/nacional")
    public ResponseEntity<List<Matricula>> getMatriculaNacional() {
        return ResponseEntity.ok(matriculaRepository.findAll());
    }

    @GetMapping("/nacional-2025-2026")
    public ResponseEntity<List<Matricula20252026>> getMatriculaNacional20252026() {
        return ResponseEntity.ok(matricula20252026Repository.findAll());
    }

    @GetMapping("/por-plantel")
    public ResponseEntity<List<MatriculaPorPlantel>> getMatriculaPorPlantel(
            @RequestParam(required = false) String colegio) {
        if (colegio != null && !colegio.isBlank()) {
            return ResponseEntity.ok(matriculaPorPlantelRepository.findByColegioIgnoreCase(colegio));
        }
        return ResponseEntity.ok(matriculaPorPlantelRepository.findAll());
    }
}
