package com.mapa.mapa.repository;

import com.mapa.mapa.entity.OfertaEducativaEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfertaEducativaEstadoRepository extends JpaRepository<OfertaEducativaEstado, Long> {
    List<OfertaEducativaEstado> findByColegioIgnoreCase(String colegio);
}
