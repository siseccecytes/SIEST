package com.mapa.mapa.controller;

import com.mapa.mapa.entity.Anexo;
import com.mapa.mapa.repository.AnexoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/anexos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnexoController {

    @Value("${pdfs.anexos}")
    private String anexosDir;

    // Mapeo colegio -> nombre exacto del archivo PDF
    private static final Map<String, String> PDF_MAP = Map.ofEntries(
        Map.entry("AGUASCALIENTES",      "AGUASCALIENTES_0160-26.pdf"),
        Map.entry("BAJA CALIFORNIA",     "BAJA CALIFORNIA_0163-26.pdf"),
        Map.entry("BAJA CALIFORNIA SUR", "BAJA CALIFORNIA SUR_0072-26.pdf"),
        Map.entry("CAMPECHE",            "04_CAMPECHE_0244-26.pdf"),
        Map.entry("CHIAPAS",             "CHIAPAS_0079-26.pdf"),
        Map.entry("CHIHUAHUA",           "CHIHUAHUA_0081-26.pdf"),
        Map.entry("COAHUILA",            "COAHUILA_0075-26.pdf"),
        Map.entry("DURANGO",             "DURANGO_0085-26.pdf"),
        Map.entry("GUANAJUATO",          "GUANAJUATO_086-26.pdf"),
        Map.entry("GUERRERO",            "GUERRERO_088-26.pdf"),
        Map.entry("HIDALGO",             "13_HIDALGO_0197-26.pdf"),
        Map.entry("JALISCO",             "14_JALISCO_0205-26.pdf"),
        Map.entry("MÉXICO",              "15_MÉXICO_0203-26.pdf"),
        Map.entry("MICHOACÁN",           "MICHOACÁN_0092-26.pdf"),
        Map.entry("MORELOS",             "MORELOS_0095-26.pdf"),
        Map.entry("NAYARIT",             "NAYARIT_0098-26.pdf"),
        Map.entry("NUEVO LEÓN",          "19_NUEVO LEÓN_0246-26.pdf"),
        Map.entry("OAXACA",              "OAXACA_0102-26.pdf"),
        Map.entry("PUEBLA",              "21_PUEBLA_0200-26.pdf"),
        Map.entry("QUERÉTARO",           "QUERÉTARO_0104-26.pdf"),
        Map.entry("QUINTANA ROO",        "QUINTANA ROO_0107-26.pdf"),
        Map.entry("SAN LUIS POTOSÍ",     "SAN LUIS POTOSI_0169-26.pdf"),
        Map.entry("SINALOA",             "SINALOA_110-26.pdf"),
        Map.entry("SONORA",              "SONORA_0113-26.pdf"),
        Map.entry("TABASCO",             "TABASCO_0115-26.pdf"),
        Map.entry("TAMAULIPAS",          "TAMAULPAS_0119-26.pdf"),
        Map.entry("TLAXCALA",            "TLAXCALA._0171-26.pdf"),
        Map.entry("VERACRUZ",            "30_VERACRUZ_0250-26.pdf"),
        Map.entry("YUCATÁN",             "YUCATÁN_0124-26.pdf"),
        Map.entry("ZACATECAS",           "32_ZACATECAS_0253-26.pdf")
    );

    private final AnexoRepository anexoRepository;

    @GetMapping
    public ResponseEntity<List<Anexo>> getAnexos() {
        return ResponseEntity.ok(anexoRepository.findAll());
    }

    @GetMapping("/pdf/{colegio}")
    public ResponseEntity<Resource> getPdf(@PathVariable String colegio) {
        String filename = PDF_MAP.get(colegio.toUpperCase().trim());
        if (filename == null) {
            // Intentar búsqueda parcial
            filename = PDF_MAP.entrySet().stream()
                .filter(e -> colegio.toUpperCase().contains(e.getKey()) ||
                             e.getKey().contains(colegio.toUpperCase()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
        }
        if (filename == null) return ResponseEntity.notFound().build();

        try {
            Path dir = Paths.get(anexosDir);
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
}
