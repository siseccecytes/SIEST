package com.mapa.mapa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MapaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MapaApplication.class, args);
	}

}
