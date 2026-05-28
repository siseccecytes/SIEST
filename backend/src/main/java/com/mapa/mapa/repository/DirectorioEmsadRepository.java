package com.mapa.mapa.repository;

import com.mapa.mapa.entity.DirectorioEmsad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DirectorioEmsadRepository extends JpaRepository<DirectorioEmsad, Long> {
    Optional<DirectorioEmsad> findByCct(String cct);
}
