package com.mapa.mapa.repository;

import com.mapa.mapa.entity.IndicadoresPorPlantel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IndicadoresPorPlantelRepository extends JpaRepository<IndicadoresPorPlantel, Long> {
    List<IndicadoresPorPlantel> findByColegioIgnoreCase(String colegio);
}
