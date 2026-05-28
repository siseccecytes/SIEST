package com.mapa.mapa.controller;

import com.mapa.mapa.entity.DirectorioCecyte;
import com.mapa.mapa.repository.DirectorioCecyteRepository;
import com.mapa.mapa.service.GeocodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/geocoding")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeocodingController {
    
    private final DirectorioCecyteRepository repository;
    private final GeocodingService geocodingService;
    
    @PostMapping("/actualizar-coordenadas")
    public ResponseEntity<String> actualizarCoordenadas() {
        List<DirectorioCecyte> planteles = repository.findAll();
        int actualizados = 0;
        
        for (DirectorioCecyte plantel : planteles) {
            if (plantel.getLatitud() == null && plantel.getDireccion() != null) {
                double[] coords = geocodingService.getCoordinates(
                    plantel.getDireccion(), 
                    plantel.getMunicipioAlcaldia()
                );
                plantel.setLatitud(coords[0]);
                plantel.setLongitud(coords[1]);
                repository.save(plantel);
                actualizados++;
            }
        }
        
        return ResponseEntity.ok("Coordenadas actualizadas: " + actualizados + " planteles");
    }
}
