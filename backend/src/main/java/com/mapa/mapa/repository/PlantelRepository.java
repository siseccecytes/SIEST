package com.mapa.mapa.repository;

import com.mapa.mapa.entity.Plantel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlantelRepository extends JpaRepository<Plantel, Long> {
    List<Plantel> findByTipo(String tipo);
    List<Plantel> findByCct(String cct);
}
