package com.mapa.mapa.controller;

import com.mapa.mapa.entity.OfertaEducativaNacional;
import com.mapa.mapa.entity.OfertaEducativaEstado;
import com.mapa.mapa.repository.OfertaEducativaNacionalRepository;
import com.mapa.mapa.repository.OfertaEducativaEstadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/oferta")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OfertaEducativaController {

    @Value("${pdfs.oferta}")
    private String pdfDir;

    private final OfertaEducativaNacionalRepository nacionalRepository;
    private final OfertaEducativaEstadoRepository estadoRepository;

    @GetMapping("/nacional")
    public ResponseEntity<List<OfertaEducativaNacional>> getNacional() {
        return ResponseEntity.ok(nacionalRepository.findAll());
    }

    @GetMapping("/por-plantel")
    public ResponseEntity<List<OfertaEducativaEstado>> getPorPlantel(
            @RequestParam(required = false) String colegio) {
        if (colegio != null && !colegio.isBlank()) {
            return ResponseEntity.ok(estadoRepository.findByColegioIgnoreCase(colegio));
        }
        return ResponseEntity.ok(estadoRepository.findAll());
    }

    @GetMapping("/pdf")
    public ResponseEntity<Resource> getPdf(@RequestParam String carrera, @RequestParam String tipo) {
        Path dir = Paths.get(pdfDir);
        String[] archivos = dir.toFile().list((d, name) -> name.endsWith(".pdf"));
        if (archivos == null) return ResponseEntity.notFound().build();

        String tipoNorm = tipo.equalsIgnoreCase("dual") ? "dual" : "presencial";

        // Palabras significativas (más de 4 letras) del nombre de la carrera
        String[] palabras = Arrays.stream(sinAcentos(carrera).split("[\\s\\-]+"))
            .filter(p -> p.length() > 4)
            .toArray(String[]::new);

        // 1. Buscar archivo que contenga todas las palabras + tipo
        String filename = Arrays.stream(archivos)
            .filter(name -> {
                String n = sinAcentos(name);
                return n.contains(tipoNorm) && Arrays.stream(palabras).allMatch(n::contains);
            })
            .findFirst().orElse(null);

        // 2. Fallback: todas las palabras sin importar tipo (PDFs sin -Presencial- en nombre)
        if (filename == null) {
            filename = Arrays.stream(archivos)
                .filter(name -> {
                    String n = sinAcentos(name);
                    return Arrays.stream(palabras).allMatch(n::contains);
                })
                .findFirst().orElse(null);
        }

        if (filename == null) return ResponseEntity.notFound().build();

        try {
            Path filePath = dir.resolve(filename).normalize();
            if (!filePath.startsWith(dir)) return ResponseEntity.badRequest().build();

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) return ResponseEntity.notFound().build();

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String sinAcentos(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
            .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
            .toLowerCase();
    }
}
