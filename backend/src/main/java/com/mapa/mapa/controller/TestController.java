package com.mapa.mapa.controller;

import com.mapa.mapa.entity.DirectorioCecyte;
import com.mapa.mapa.repository.DirectorioCecyteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestController {
    
    private final DirectorioCecyteRepository repository;
    
    @GetMapping("/planteles")
    public ResponseEntity<List<DirectorioCecyte>> getAllPlanteles() {
        return ResponseEntity.ok(repository.findAll());
    }
    
    @GetMapping("/count")
    public ResponseEntity<String> count() {
        long count = repository.count();
        return ResponseEntity.ok("Total de planteles: " + count);
    }
}
