package com.mapa.mapa.repository;

import com.mapa.mapa.entity.DocentesPorPlantel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocentesPorPlantelRepository extends JpaRepository<DocentesPorPlantel, Long> {
    List<DocentesPorPlantel> findByColegioIgnoreCase(String colegio);
}
