package com.mapa.mapa.repository;

import com.mapa.mapa.entity.MatriculaPorPlantel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MatriculaPorPlantelRepository extends JpaRepository<MatriculaPorPlantel, Long> {
    List<MatriculaPorPlantel> findByColegioIgnoreCase(String colegio);
}
