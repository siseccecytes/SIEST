package com.mapa.mapa.controller;

import com.mapa.mapa.dto.PlantelMapaDTO;
import com.mapa.mapa.entity.DirectorioCecyte;
import com.mapa.mapa.entity.DirectorioEmsad;
import com.mapa.mapa.entity.Estado;
import com.mapa.mapa.entity.InfoEstatal;
import com.mapa.mapa.entity.InfoFederal;
import com.mapa.mapa.entity.Plantel;
import com.mapa.mapa.repository.DirectorioCecyteRepository;
import com.mapa.mapa.repository.DirectorioEmsadRepository;
import com.mapa.mapa.repository.InfoEstatalRepository;
import com.mapa.mapa.repository.InfoFederalRepository;
import com.mapa.mapa.repository.PlantelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/mapa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MapaController {
    
    private final InfoFederalRepository infoFederalRepository;
    private final InfoEstatalRepository infoEstatalRepository;
    private final DirectorioCecyteRepository directorioCecyteRepository;
    private final DirectorioEmsadRepository directorioEmsadRepository;
    private final PlantelRepository plantelRepository;
    
    @GetMapping("/estados")
    public ResponseEntity<List<Estado>> getEstados() {
        // Obtener estados únicos que tienen datos en info_estatal
        List<InfoEstatal> estadosConDatos = infoEstatalRepository.findAll();
        
        List<Estado> estados = estadosConDatos.stream()
                .map(info -> {
                    String nombreEstado = info.getColegio();
                    Estado estado = getEstadoCoordenadas(nombreEstado);
                    return estado;
                })
                .filter(estado -> estado != null)
                .distinct()
                .toList();
        
        return ResponseEntity.ok(estados);
    }
    
    private Estado getEstadoCoordenadas(String nombre) {
        // Mapa de coordenadas de estados
        return switch (nombre.toUpperCase()) {
            case "AGUASCALIENTES" -> new Estado("Aguascalientes", 21.8853, -102.2916);
            case "BAJA CALIFORNIA" -> new Estado("Baja California", 30.8406, -115.2838);
            case "BAJA CALIFORNIA SUR" -> new Estado("Baja California Sur", 26.0444, -111.6661);
            case "CAMPECHE" -> new Estado("Campeche", 19.8301, -90.5349);
            case "CHIAPAS" -> new Estado("Chiapas", 16.7569, -93.1292);
            case "CHIHUAHUA" -> new Estado("Chihuahua", 28.6353, -106.0889);
            case "CIUDAD DE MÉXICO", "CDMX" -> new Estado("Ciudad de México", 19.4326, -99.1332);
            case "COAHUILA" -> new Estado("Coahuila", 27.0587, -101.7068);
            case "COLIMA" -> new Estado("Colima", 19.2452, -103.7241);
            case "DURANGO" -> new Estado("Durango", 24.0277, -104.6532);
            case "GUANAJUATO" -> new Estado("Guanajuato", 21.0190, -101.2574);
            case "GUERRERO" -> new Estado("Guerrero", 17.4392, -99.5451);
            case "HIDALGO" -> new Estado("Hidalgo", 20.0911, -98.7624);
            case "JALISCO" -> new Estado("Jalisco", 20.6597, -103.3496);
            case "ESTADO DE MÉXICO", "MÉXICO" -> new Estado("Estado de México", 19.2826, -99.6557);
            case "MICHOACÁN" -> new Estado("Michoacán", 19.5665, -101.7068);
            case "MORELOS" -> new Estado("Morelos", 18.6813, -99.1013);
            case "NAYARIT" -> new Estado("Nayarit", 21.7514, -104.8455);
            case "NUEVO LEÓN" -> new Estado("Nuevo León", 25.6866, -100.3161);
            case "OAXACA" -> new Estado("Oaxaca", 17.0732, -96.7266);
            case "PUEBLA" -> new Estado("Puebla", 19.0414, -98.2063);
            case "QUERÉTARO" -> new Estado("Querétaro", 20.5888, -100.3899);
            case "QUINTANA ROO" -> new Estado("Quintana Roo", 19.1817, -88.4791);
            case "SAN LUIS POTOSÍ" -> new Estado("San Luis Potosí", 22.1565, -100.9855);
            case "SINALOA" -> new Estado("Sinaloa", 24.8049, -107.3940);
            case "SONORA" -> new Estado("Sonora", 29.2972, -110.3309);
            case "TABASCO" -> new Estado("Tabasco", 17.8409, -92.6189);
            case "TAMAULIPAS" -> new Estado("Tamaulipas", 24.2669, -98.8363);
            case "TLAXCALA" -> new Estado("Tlaxcala", 19.3139, -98.2404);
            case "VERACRUZ" -> new Estado("Veracruz", 19.1738, -96.1342);
            case "YUCATÁN" -> new Estado("Yucatán", 20.7099, -89.0943);
            case "ZACATECAS" -> new Estado("Zacatecas", 22.7709, -102.5832);
            default -> null;
        };
    }
    
    @GetMapping("/info-federal")
    public ResponseEntity<List<InfoFederal>> getInfoFederal() {
        return ResponseEntity.ok(infoFederalRepository.findAll());
    }
    
    @GetMapping("/info-estatal/{estado}")
    public ResponseEntity<InfoEstatal> getInfoEstatal(@PathVariable String estado) {
        return infoEstatalRepository.findByColegio(estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/planteles/{estado}")
    public ResponseEntity<List<PlantelMapaDTO>> getPlantelesByEstado(@PathVariable String estado) {
        String estadoUpper = estado.toUpperCase();
        
        List<Plantel> planteles = plantelRepository.findAll().stream()
                .filter(p -> p.getColegio() != null && p.getColegio().equalsIgnoreCase(estadoUpper))
                .toList();
        
        // Coordenadas del centro del estado como fallback
        Estado estadoInfo = getEstadoByNombre(estado);
        
        List<PlantelMapaDTO> resultado = new ArrayList<>();
        
        for (Plantel plantel : planteles) {
            Double lat = null;
            Double lon = null;
            String direccion = null;
            
            // Buscar en directorio_cecyte
            Optional<DirectorioCecyte> cecyte = directorioCecyteRepository.findByCct(plantel.getCct());
            if (cecyte.isPresent() && cecyte.get().getLatitud() != null) {
                lat = cecyte.get().getLatitud();
                lon = cecyte.get().getLongitud();
                direccion = cecyte.get().getDireccion();
            } else {
                // Buscar en directorio_emsad
                Optional<DirectorioEmsad> emsad = directorioEmsadRepository.findByCct(plantel.getCct());
                if (emsad.isPresent() && emsad.get().getLatitud() != null) {
                    lat = emsad.get().getLatitud();
                    lon = emsad.get().getLongitud();
                    direccion = emsad.get().getDireccion();
                }
            }
            
            // Usar coordenadas del estado como fallback
            if (lat == null && estadoInfo != null) {
                lat = estadoInfo.getLatitud();
                lon = estadoInfo.getLongitud();
            }
            
            if (lat != null && lon != null) {
                resultado.add(new PlantelMapaDTO(
                    plantel.getId(),
                    plantel.getColegio(),
                    plantel.getCct(),
                    plantel.getTipo(),
                    plantel.getNombreDelPlantel(),
                    plantel.getEficienciaTerminal(),
                    plantel.getDesafiliacionEscolar(),
                     plantel.getReprobacion(),
                    plantel.getMatricula(),
                    lat,
                    lon,
                    direccion
                ));
            }
        }
        
        return ResponseEntity.ok(resultado);
    }
    
    private Estado getEstadoByNombre(String nombre) {
        return getEstadoCoordenadas(nombre);
    }
    
    @GetMapping("/plantel/{id}")
    public ResponseEntity<Plantel> getPlantelById(@PathVariable Long id) {
        return plantelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
