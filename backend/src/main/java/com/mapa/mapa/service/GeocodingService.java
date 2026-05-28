package com.mapa.mapa.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GeocodingService {
    
    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private final RestTemplate restTemplate = new RestTemplate();
    
    public double[] getCoordinates(String direccion, String municipio) {
        try {
            Thread.sleep(1000); // Respetar límite de 1 req/segundo
            
            String fullAddress = direccion + ", " + municipio + ", México";
            
            String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                    .queryParam("q", fullAddress)
                    .queryParam("format", "json")
                    .queryParam("limit", "1")
                    .toUriString();
            
            JsonNode[] response = restTemplate.getForObject(url, JsonNode[].class);
            
            if (response != null && response.length > 0) {
                double lat = response[0].get("lat").asDouble();
                double lon = response[0].get("lon").asDouble();
                log.info("Coordenadas obtenidas para {}: [{}, {}]", fullAddress, lat, lon);
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            log.error("Error obteniendo coordenadas para: {}", direccion, e);
        }
        
        return new double[]{19.4326, -99.1332}; // Ciudad de México por defecto
    }
}
